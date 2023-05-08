import { Document } from 'mongoose';
import { IAddress } from './IAddress';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  defaultAddress?: IAddress;
}

export interface IUserMethods {
  comparePasswords(password: string): boolean;
}
