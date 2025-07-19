import { Router } from 'express';
import authRoutes from './authRoutes';
import postRoutes from './postRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

export default router;