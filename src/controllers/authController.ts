import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { CONFIG } from "@/config";
import { createError } from "@/middleware/error";
import { RegisterData, LoginData } from "@/utils/schemas";

export class AuthController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - firstName
   *               - lastName
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Bad request
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body as RegisterData;

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        throw createError("User with this email already exists", 400);
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          firstName,
          lastName,
        })
        .returning({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          createdAt: users.createdAt,
        });

      // Generate JWT token
      // @ts-ignore
      const token = jwt.sign({ userId: newUser[0].id }, CONFIG.JWT_SECRET, {
        expiresIn: CONFIG.JWT_EXPIRES_IN,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: newUser[0],
          token,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as LoginData;

      // Find user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user.length) {
        throw createError("Invalid email or password", 401);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user[0].password);
      if (!isPasswordValid) {
        throw createError("Invalid email or password", 401);
      }

      // Generate JWT token
      // @ts-ignore
      const token = jwt.sign({ userId: user[0].id }, CONFIG.JWT_SECRET, {
        expiresIn: CONFIG.JWT_EXPIRES_IN,
      });

      const { password: _, ...userWithoutPassword } = user[0];

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get current user profile
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const { user } = req as any;

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      throw error;
    }
  }
}
