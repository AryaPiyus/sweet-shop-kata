import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('1. Auth Header Received:', authHeader); 

    if (!authHeader) {
      throw new Error('No header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const secret = process.env.JWT_SECRET || 'supersecret';

    const decoded = jwt.verify(token, secret);
    console.log('4. Token Decoded Successfully:', decoded);

    // FIX: Force TypeScript to treat 'decoded' as our specific object type
    (req as AuthRequest).user = decoded as { userId: string; role: string }; 
    
    next();
  } catch (error) {
    console.error('!!! AUTH ERROR !!!', error);
    res.status(401).send({ message: 'Invalid token' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as AuthRequest).user;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  next();
};