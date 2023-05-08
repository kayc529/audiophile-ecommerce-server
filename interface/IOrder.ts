import { Document, Types } from 'mongoose';
import { IAddress } from './IAddress';
import { ICartItem } from './ICartItem';

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  status: string;
  items: ICartItem[];
  grandTotal: number;
  subtotal: number;
  tax: number;
  shipping: number;
  shippingAddress: IAddress;
  paymentMethod: string;
  cardNumber?: string;
  shippedAt?: Date;
}
