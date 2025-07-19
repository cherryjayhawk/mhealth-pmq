import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Post schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().optional(),
  isPublished: z.boolean().optional().default(false),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).optional(),
  content: z.string().optional(),
  isPublished: z.boolean().optional(),
});

// Param schemas
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});

// Query schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type CreatePostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;