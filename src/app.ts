import express from "express"
import session from "express-session";

import sessionConfig from "./config/session";
import authRoutes from "./routes/authRoutes"
import eventRoutes from "./routes/eventRoutes"
import logger from "./utils/logger";

const app:any = express();

app.use(express.json());
app.use(session(sessionConfig));

// Log every req to the server
app.use((req:any, res:any, next:any) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// Add auth routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use((err:any, req:any, res:any, next:any) => {
    logger.error('Server error:', err);
    res.status(500).json({ error: 'Something went wrong'});
});

export default app;