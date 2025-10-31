const express = require('express');
const app = express();
const port = 3000;

const health = [
       { "status": "healthy", "uptime": process.uptime() }
];

const tasksRouter = require('./routes/tasks');

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


