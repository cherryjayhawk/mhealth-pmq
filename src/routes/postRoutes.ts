import { Router } from 'express';
import { PostController } from '@/controllers/postController';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { createPostSchema, updatePostSchema, idParamSchema, paginationSchema } from '@/utils/schemas';

const router = Router();

// Public routes
router.get('/', validateQuery(paginationSchema), PostController.getAllPosts);
router.get('/:id', validateParams(idParamSchema), PostController.getPostById);
router.get('/user/:userId', validateParams(idParamSchema), validateQuery(paginationSchema), PostController.getPostsByUserId);

// Protected routes
router.post('/', authenticateToken, validateBody(createPostSchema), PostController.createPost);
router.put('/:id', authenticateToken, validateParams(idParamSchema), validateBody(updatePostSchema), PostController.updatePost);
router.delete('/:id', authenticateToken, validateParams(idParamSchema), PostController.deletePost);

export default router;