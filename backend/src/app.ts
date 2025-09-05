import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './api/routes';
import { errorHandler } from './api/middlewares/errorHandler';
import { initializeVectorStore } from './core/ai/rag/ingestion.service';

const app: Express = express();

// Initialize the in-memory vector store on startup
initializeVectorStore().catch(console.error);

// Middleware
app.use(cors({
    // In a real app, this would be a more restrictive list of origins
    origin: true, 
    credentials: true,
}));
// FIX: Cast middleware to any to resolve overload errors.
app.use(express.json() as any);
// FIX: Cast middleware to any to resolve overload errors.
app.use(cookieParser() as any);

// API Routes
// FIX: Cast middleware to any to resolve overload errors.
app.use('/api', apiRouter as any);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error Handling Middleware
// FIX: Cast middleware to any to resolve overload errors.
app.use(errorHandler as any);

export default app;