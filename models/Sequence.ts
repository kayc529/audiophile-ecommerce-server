import { Schema, model } from 'mongoose';
import { ISequence } from '../interface/ISequence';

const sequenceSchema = new Schema<ISequence>({
  _id: {
    type: String,
    require: true,
    unique: true,
  },
  sequence: {
    type: Number,
    require: true,
  },
});

export const Sequence = model<ISequence>('Sequence', sequenceSchema);
