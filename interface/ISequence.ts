import { Document } from 'mongoose';

export interface ISequence extends Document {
  _id: string;
  sequence: number;
}
