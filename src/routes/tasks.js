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
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

module.exports = router;
