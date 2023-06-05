import { IUser } from '../interface/IUser';
import { NotFoundError } from '../error';

export const createTokenUser = (user: IUser | null) => {
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    userId: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    defaultAddress: user.defaultAddress,
  };
};
