import { ICartItem } from './ICartItem';

export interface ICart {
  sessionId: string;
  items: ICartItem[];
  createdAt?: string;
}
