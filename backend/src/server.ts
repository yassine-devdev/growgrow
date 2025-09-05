import app from './app';
import config from './config';
import logger from './utils/logger';
import { cacheService } from './services/cache.service';


const startServer = async (): Promise<void> => {
    try {
        await cacheService.connect();
        app.listen(config.port, () => {
            logger.info(`Server running on http://localhost:${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error as Error);
        // FIX: Cast process to `any` to bypass TS error when types are misconfigured.
        (process as any).exit(1);
    }
};

startServer();

// Graceful shutdown
// FIX: Cast process to `any` to bypass TS error when types are misconfigured.
(process as any).on('SIGINT', async () => {
    logger.info('Shutting down server...');
    await cacheService.disconnect();
    // FIX: Cast process to `any` to bypass TS error when types are misconfigured.
    (process as any).exit(0);
});