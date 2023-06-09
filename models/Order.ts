import { Schema, model } from 'mongoose';
import { IOrder } from '../interface/IOrder';
import { addressSchema } from './User';

const orderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.Mixed,
      immutable: true,
    },
    orderId: {
      type: Number,
      immutable: true,
      require: true,
    },
    status: {
      type: String,
      enum: ['IN-PROGRESS', 'CANCELED', 'SHIPPED', 'DELIVERED'],
      default: 'IN-PROGRESS',
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
    },
    grandTotal: {
      type: Number,
      require: true,
    },
    subtotal: {
      type: Number,
      require: true,
    },
    tax: {
      type: Number,
      require: true,
    },
    shipping: {
      type: Number,
      require: true,
    },
    shippingAddress: {
      type: addressSchema,
      require: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'emoney'],
      require: true,
    },
    cardNumber: String,
    shippedAt: Date,
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);
