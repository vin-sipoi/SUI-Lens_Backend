import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import env from '../config/env';
import sql from './db';

const PgStore = connectPgSimple(session);

const sessionConfig: session.SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PgStore({
        pool: sql,
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

export default sessionConfig;