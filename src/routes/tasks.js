import express from 'express';

import db from '../config/db.js';
import logger from '../config/logger.js';

const router = express.Router();

const STATUSES = new Set(['pending', 'in-progress', 'completed']);

const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limitRaw = parseInt(req.query.limit, 10);
  let limit = Number.isNaN(limitRaw) ? 10 : limitRaw;
  limit = Math.min(Math.max(limit, 1), 50);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const buildSearchClause = (query) => {
  const term = query?.trim();
  if (!term) {
    return { clause: 'deleted_at IS NULL', params: [] };
  }
  return {
    clause: 'deleted_at IS NULL AND LOWER(title) LIKE ?',
    params: [`%${term.toLowerCase()}%`]
  };
};

const handleDbError = (res, err, message = 'Database error') => {
  logger.error(message, { error: err.message });
  return res.status(500).json({ error: message });
};

// GET all tasks with pagination and optional search
router.get('/', async (req, res) => {
  const { page, limit, offset } = parsePagination(req);
  const { clause, params } = buildSearchClause(req.query.q);

  try {
    const countQuery = `SELECT COUNT(*) AS total FROM tasks WHERE ${clause}`;
    const [countRows] = await db.query(countQuery, params);
    const totalTasks = countRows[0]?.total || 0;
    const totalPages = totalTasks === 0 ? 0 : Math.ceil(totalTasks / limit);

    const dataQuery = `
      SELECT id, title, description, status, created_at, updated_at
      FROM tasks
      WHERE ${clause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(dataQuery, [...params, limit, offset]);

    res.json({
      totalTasks,
      totalPages,
      currentPage: page,
      limit,
      data: rows
    });
  } catch (err) {
    return handleDbError(res, err);
  }
});

// GET soft-deleted tasks
router.get('/deleted', async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, description, status, deleted_at
       FROM tasks
       WHERE deleted_at IS NOT NULL
       ORDER BY deleted_at DESC`
    );
    res.json(rows);
  } catch (err) {
    return handleDbError(res, err);
  }
});

// POST create new task
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title.trim(), description || null]
    );

    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [
      result.insertId
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    return handleDbError(res, err, 'Failed to create task');
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const updates = [];
  const values = [];

  if (title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    updates.push('title = ?');
    values.push(title.trim());
  }

  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }

  if (status !== undefined) {
    if (!STATUSES.has(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    updates.push('status = ?');
    values.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const sql = `UPDATE tasks SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
    values.push(id);
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    return handleDbError(res, err, 'Failed to update task');
  }
});

// DELETE task (soft delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE tasks SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or already deleted' });
    }

    res.status(204).send();
  } catch (err) {
    return handleDbError(res, err, 'Failed to delete task');
  }
});

// RESTORE soft-deleted task
router.put('/:id/restore', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE tasks SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or not deleted' });
    }

    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    return handleDbError(res, err, 'Failed to restore task');
  }
});

export default router;
