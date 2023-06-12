import { Types } from 'mongoose';

export interface ISession {
  sessionId: string;
  user?: Types.ObjectId;
}
