import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { validateBody } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { registerSchema, loginSchema } from '@/utils/schemas';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);

// Protected routes
router.get('/me', authenticateToken, AuthController.getProfile);

export default router;