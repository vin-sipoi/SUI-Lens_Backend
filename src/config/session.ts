import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import env from '../config/env';
import { Pool } from 'pg';
import sql from './db'; // Keep using this for general queries if you want

const PgStore = connectPgSimple(session);

// Create a real Pool instance for session storage
const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Optional, based on your Neon setup
    },
});

const sessionConfig: session.SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PgStore({
        pool: pool,
        tableName: 'sessions',
        createTableIfMissing: true,
    }),
    cookie: {
        secure: env.NODE_ENV === 'production',
        maxAge: env.SESSION_COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: 'strict',
    },
};
export {pool}
export default sessionConfig;
