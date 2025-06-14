
// Sample Supabase Auth/JWT middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.SUPABASE_JWT_SECRET!, (err, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user; // user.gym_id should be set via claims or custom access token
    next();
  });
}
