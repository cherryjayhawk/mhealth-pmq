import { Request, Response } from 'express';
import { db, posts, users } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { createError } from '@/middleware/error';
import { CreatePostData, UpdatePostData } from '@/utils/schemas';
import { AuthRequest } from '@/middleware/auth';

export class PostController {
  /**
   * @swagger
   * /api/posts:
   *   get:
   *     summary: Get all posts
   *     tags: [Posts]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of posts per page
   *     responses:
   *       200:
   *         description: Posts retrieved successfully
   */
  static async getAllPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const allPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          isPublished: posts.isPublished,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          author: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      res.json({
        success: true,
        data: {
          posts: allPosts,
          pagination: {
            page,
            limit,
            hasMore: allPosts.length === limit,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/posts/{id}:
   *   get:
   *     summary: Get post by ID
   *     tags: [Posts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Post ID
   *     responses:
   *       200:
   *         description: Post retrieved successfully
   *       404:
   *         description: Post not found
   */
  static async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          isPublished: posts.isPublished,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          author: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.id, parseInt(id)))
        .limit(1);

      if (!post.length) {
        throw createError('Post not found', 404);
      }

      res.json({
        success: true,
        data: { post: post[0] },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/posts:
   *   post:
   *     summary: Create a new post
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *               isPublished:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Post created successfully
   *       401:
   *         description: Unauthorized
   */
  static async createPost(req: AuthRequest, res: Response) {
    try {
      const { title, content, isPublished } = req.body as CreatePostData;
      const userId = req.user!.id;

      const newPost = await db.insert(posts).values({
        title,
        content,
        isPublished: isPublished || false,
        authorId: userId,
      }).returning();

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: { post: newPost[0] },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/posts/{id}:
   *   put:
   *     summary: Update post by ID
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Post ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *               isPublished:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Post updated successfully
   *       404:
   *         description: Post not found
   *       403:
   *         description: Not authorized to update this post
   */
  static async updatePost(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updateData = req.body as UpdatePostData;

      // Check if post exists and user owns it
      const existingPost = await db.select()
        .from(posts)
        .where(eq(posts.id, parseInt(id)))
        .limit(1);

      if (!existingPost.length) {
        throw createError('Post not found', 404);
      }

      if (existingPost[0].authorId !== userId) {
        throw createError('Not authorized to update this post', 403);
      }

      // Update post
      const updatedPost = await db
        .update(posts)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, parseInt(id)))
        .returning();

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: { post: updatedPost[0] },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/posts/{id}:
   *   delete:
   *     summary: Delete post by ID
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Post ID
   *     responses:
   *       200:
   *         description: Post deleted successfully
   *       404:
   *         description: Post not found
   *       403:
   *         description: Not authorized to delete this post
   */
  static async deletePost(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Check if post exists and user owns it
      const existingPost = await db.select()
        .from(posts)
        .where(eq(posts.id, parseInt(id)))
        .limit(1);

      if (!existingPost.length) {
        throw createError('Post not found', 404);
      }

      if (existingPost[0].authorId !== userId) {
        throw createError('Not authorized to delete this post', 403);
      }

      // Delete post
      await db.delete(posts).where(eq(posts.id, parseInt(id)));

      res.json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/posts/user/{userId}:
   *   get:
   *     summary: Get posts by user ID
   *     tags: [Posts]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of posts per page
   *     responses:
   *       200:
   *         description: User posts retrieved successfully
   */
  static async getPostsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const userPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          isPublished: posts.isPublished,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(eq(posts.authorId, parseInt(userId)))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      res.json({
        success: true,
        data: {
          posts: userPosts,
          pagination: {
            page,
            limit,
            hasMore: userPosts.length === limit,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}