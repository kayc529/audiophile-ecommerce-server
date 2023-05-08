import { IUser } from '../interface/IUser';

export const createTokenUser = (user: IUser) => {
  return {
    userId: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    defaultAddress: user.defaultAddress,
  };
};
