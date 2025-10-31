const express = require('express');
const router = express.Router();

const tasks = [
  { id: 1, title: 'Learn Node.js', completed: false, priority: 'high', createdAt: new Date() },
  { id: 2, title: 'Build REST API', completed: false, priority: 'high', createdAt: new Date() },
  { id: 3, title: 'Install Express.js', completed: true, priority: 'medium', createdAt: new Date() },
  { id: 4, title: 'Install npm packages', completed: true, priority: 'low', createdAt: new Date() },
  { id: 5, title: 'Initialize Git', completed: true, priority: 'high', createdAt: new Date() }
];

router.get('/', (req, res) => {
  res.json(tasks);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  // ✅ 1. Validate that ID is a number
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const numericId = parseInt(id);
  const task = tasks.find(t => t.id === numericId);

  // ✅ 2. Handle non-existent task
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // ✅ 3. Success response
  res.json(task);
});

module.exports = router;
