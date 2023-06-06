import { Document } from 'mongoose';
import { IAddress } from './IAddress';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  defaultAddress?: IAddress;
  addresses?: IAddress[];
}

export interface IUserMethods {
  comparePasswords(password: string): boolean;
}
