import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase, dbService } from './server/db.js';
import { authRouter } from './server/routes/auth.js';
import { carsRouter } from './server/routes/cars.js';
import { adminRouter } from './server/routes/admin.js';
import { customerRouter } from './server/routes/customer.js';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize Database
  await initDatabase();

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      dealership: 'Bharat Wheels India',
      timestamp: new Date().toISOString(),
      databaseMode: dbService.isPostgres() ? 'postgresql' : 'local-persistent-store',
      uptimeSeconds: Math.floor(process.uptime())
    });
  });

  // Mount API Endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/cars', carsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api', customerRouter);

  // Global Error Handler for API routes
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error'
    });
  });

  // Frontend Integration: Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Bharat Wheels server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Bharat Wheels server:', err);
  process.exit(1);
});
