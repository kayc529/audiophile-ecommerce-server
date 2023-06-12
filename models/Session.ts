import { Schema, model } from 'mongoose';
import { ISession } from '../interface/ISession';

const sessionSchema = new Schema({
  sessionId: {
    type: String,
    require: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
  },
});

export const Session = model<ISession>('Session', sessionSchema);
