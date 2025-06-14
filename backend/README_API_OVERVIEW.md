
.
├── models/
│   ├── Gym.ts
│   ├── Trainer.ts
│   ├── Member.ts
│   ├── Membership.ts
│   ├── Session.ts
│   ├── Class.ts
│   ├── Booking.ts
│   ├── Equipment.ts
│   └── Payment.ts
├── controllers/
│   ├── gymController.ts
│   ├── trainerController.ts
│   ├── memberController.ts
│   ├── membershipController.ts
│   ├── sessionController.ts
│   ├── classController.ts
│   ├── bookingController.ts
│   ├── equipmentController.ts
│   └── paymentController.ts
├── routes/
│   ├── gymRoutes.ts
│   ├── trainerRoutes.ts
│   ├── memberRoutes.ts
│   ├── membershipRoutes.ts
│   ├── sessionRoutes.ts
│   ├── classRoutes.ts
│   ├── bookingRoutes.ts
│   ├── equipmentRoutes.ts
│   └── paymentRoutes.ts
├── middleware/
│   └── auth.ts
├── utils/
│   ├── businessLogic.ts
│   └── notifications.ts
└── app.ts

# Sample: backend/models/Trainer.ts
export interface Trainer {
  id: string;
  gym_id: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
}

# Sample: backend/controllers/memberController.ts
import { Request, Response } from 'express';
import { db } from '../utils/db';
export const getMembers = async (req: Request, res: Response) => {
  const gym_id = req.user.gym_id;
  const members = await db('members').where('gym_id', gym_id);
  res.json(members);
};

# Sample: backend/middleware/auth.ts
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

# Sample: backend/utils/businessLogic.ts
export function calculateTrainerPayout(attendance: any[]): number {
  return attendance.length * 500; // example payout calculation
}
export function autoRenewMembership(membership: any) {
  // sample: if expired, extend by membership.plan.duration_days
}
