import { Schema, model } from 'mongoose';
import { ICart } from '../interface/ICart';

const cartSchema = new Schema(
  {
    sessionId: {
      type: String,
      require: true,
      unique: true,
    },
    items: {
      type: [
        {
          productId: {
            type: String,
            require: true,
          },
          productCode: {
            type: String,
            require: true,
          },
          thumbnail: String,
          price: {
            type: Number,
            require: true,
          },
          quantity: {
            type: Number,
            require: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Cart = model<ICart>('Cart', cartSchema);
