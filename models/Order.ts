import { Schema, model } from 'mongoose';
import { IOrder } from '../interface/IOrder';
import { addressSchema } from './User';

const orderSchema = new Schema<IOrder>({
  customerId: {
    type: Schema.Types.ObjectId,
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
    enum: ['CASH', 'EMONEY'],
    require: true,
  },
  cardNumber: String,
  shippedAt: Date,
});

module.exports = model<IOrder>('Order', orderSchema);
