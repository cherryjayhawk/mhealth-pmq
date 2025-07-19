import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '@/config';
import { db, users } from '@/db';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as any;
    
    // Get user from database
    const user = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    }).from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1);

    if (!user.length) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.user = user[0];
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};