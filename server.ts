import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db/connection.js';
import authRoutes from './server/routes/auth.js';
import challengeRoutes from './server/routes/challenges.js';
import missionRoutes from './server/routes/missions.js';
import badgeRoutes from './server/routes/badges.js';
import leaderboardRoutes from './server/routes/leaderboard.js';
import aiRoutes from './server/routes/ai.js';
import { apiLimiter } from './server/middleware/rateLimit.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Basic security and parsing middleware
  app.use(cors());
  app.use(express.json());

  // Attempt database connection
  await connectDB();

  // API Routes
  app.use('/api', apiLimiter);
  app.use('/api/auth', authRoutes);
  app.use('/api/challenges', challengeRoutes);
  app.use('/api/missions', missionRoutes);
  app.use('/api/badges', badgeRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/ai', aiRoutes);

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'active', app: 'Cyber Guardian', version: '1.0.0' });
  });

  // Centralized Error Handler (No stack traces to client)
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[Server Error]', err?.message || err);
    res.status(err?.status || 500).json({
      error: 'Unable to connect. Please try again.',
    });
  });

  // Vite integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Cyber Guardian] System online on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup failure:', err);
  process.exit(1);
});
