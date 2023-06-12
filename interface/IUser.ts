import { Document, Types } from 'mongoose';
import { IAddress } from './IAddress';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  defaultAddress?: IAddress;
  addresses?: IAddress[];
  cartId?: Types.ObjectId;
}

export interface IUserMethods {
  comparePasswords(password: string): boolean;
}
