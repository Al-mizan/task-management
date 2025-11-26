import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    PORT = 3000,
    NODE_ENV = 'development',
    DB_HOST = 'localhost',
    DB_USER = 'taskuser',
    DB_PASSWORD = 'taskpass123',
    DB_NAME = 'taskdb',
    DB_CONNECTION_LIMIT = '10'
} = process.env;