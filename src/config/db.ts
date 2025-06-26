import { neon } from '@neondatabase/serverless';
import env from './env';
import logger from '../utils/logger';

const sql = neon(env.DATABASE_URL);

async function testConnection() {
    try {
        await sql`SELECT 1`;
        logger.info('Connected to Neon DB');
    } catch (err) {
        logger.error('Neon DB connection error:', err);
        process.exit(1);
    }
}

testConnection();

export default sql;