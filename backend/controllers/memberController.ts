
// Sample: get members of a gym
import { Request, Response } from 'express';
import { db } from '../utils/db';

export const getMembers = async (req: Request, res: Response) => {
  const gym_id = req.user.gym_id;
  const members = await db('members').where('gym_id', gym_id);
  res.json(members);
};
