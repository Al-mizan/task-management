import express from 'express';

import { PORT } from './config/env.js';
import tasksRouter from './routes/tasks.js';

const app = express();
const port = PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
