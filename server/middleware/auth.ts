import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbService } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bharat-wheels-jwt-super-secret-key-2026';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SALES_MANAGER';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.'
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await dbService.adminUsers.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User session is invalid or user no longer exists.'
      });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token.'
    });
  }
}

export function requireRole(allowedRoles: ('SUPER_ADMIN' | 'ADMIN' | 'SALES_MANAGER')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Access forbidden: Insufficient administrative privileges.'
      });
      return;
    }
    next();
  };
}

// In-memory rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitLogin(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record) {
    if (now < record.resetTime) {
      if (record.count >= 10) {
        res.status(429).json({
          success: false,
          error: 'Too many login attempts. Please try again after 5 minutes.'
        });
        return;
      }
      record.count += 1;
    } else {
      loginAttempts.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
    }
  } else {
    loginAttempts.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
  }

  next();
}

// In-memory rate limiting for public form submissions (lead spam protection)
const formSubmissionAttempts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitPublicForms(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = formSubmissionAttempts.get(ip);

  if (record) {
    if (now < record.resetTime) {
      if (record.count >= 20) {
        res.status(429).json({
          success: false,
          error: 'Submission rate limit reached. Please wait a few moments before trying again.'
        });
        return;
      }
      record.count += 1;
    } else {
      formSubmissionAttempts.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
    }
  } else {
    formSubmissionAttempts.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
  }

  next();
}
