import db from './config/db.js';
import logger from './config/logger.js';

const sampleTasks = [
  {
    title: 'Learn MySQL basics',
    description: 'Review CREATE, SELECT, UPDATE, DELETE statements',
    status: 'pending'
  },
  {
    title: 'Design database schema',
    description: 'Finalize tables for task management app',
    status: 'in-progress'
  },
  {
    title: 'Write Express routes',
    description: 'Implement CRUD endpoints using MySQL',
    status: 'completed'
  },
  {
    title: 'Test POST /tasks endpoint',
    description: 'Ensure validation handles missing titles',
    status: 'pending'
  },
  {
    title: 'Set up logger',
    description: 'Configure winston to capture DB errors',
    status: 'completed'
  },
  {
    title: 'Create Postman collection',
    description: 'Document all API requests for LAB 3',
    status: 'in-progress'
  },
  {
    title: 'Practice SQL LIKE queries',
    description: 'Add search capability for task titles',
    status: 'pending'
  },
  {
    title: 'Implement pagination',
    description: 'Support page and limit query params',
    status: 'in-progress'
  },
  {
    title: 'Add seed script',
    description: 'Populate demo data for testing UI',
    status: 'completed'
  },
  {
    title: 'Soft delete tasks',
    description: 'Introduce deleted_at column and related routes',
    status: 'pending'
  },
  {
    title: 'Restore deleted tasks',
    description: 'Add route to bring tasks back from recycle bin',
    status: 'pending'
  },
  {
    title: 'Write lab report',
    description: 'Compare in-memory arrays vs MySQL database',
    status: 'in-progress'
  },
  {
    title: 'Review error handling',
    description: 'Ensure API returns meaningful messages',
    status: 'completed'
  },
  {
    title: 'Verify data persistence',
    description: 'Restart server and confirm tasks remain',
    status: 'pending'
  },
  {
    title: 'Polish README instructions',
    description: 'Add steps for setup and testing',
    status: 'in-progress'
  }
];

const seed = async () => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM tasks');
    if (rows[0]?.count > 0) {
      console.log('Tasks already exist. Skipping seed to avoid duplicates.');
      return;
    }
    
    const placeholders = sampleTasks.map(() => '(?, ?, ?)').join(', ');
    const values = sampleTasks.flatMap((task) => [
      task.title,
      task.description,
      task.status
    ]);

    await db.query(
      `INSERT INTO tasks (title, description, status) VALUES ${placeholders}`,
      values
    );
    console.log(`Inserted ${sampleTasks.length} sample tasks.`);
  } catch (err) {
    logger.error('Failed to seed database', { error: err.message });
    console.error('Failed to seed database. Check logs/error.log for details.');
  } finally {
    await db.end();
  }
};

seed().finally(() => process.exit(0));