import express from 'express';

const app = express();
const port = 3000;

const health = [
       { "status": "healthy", "uptime": process.uptime() }
];

import tasksRouter from './routes/tasks.js';

app.get('/', (req, res) => {
       res.send('Task Management API is running!');
});

app.use('/tasks', tasksRouter);

app.get('/health', (req, res) => {
	res.json(health);
});

app.listen(port, () => {
       console.log(`Server running at http://localhost:${port}`);
});


