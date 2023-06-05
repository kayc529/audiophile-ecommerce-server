import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthorizedError } from '../error';
import { createTokenUser } from '../utils/createTokenUser';

export const getUserInfo = async (req, res) => {
  const { userId } = req.params;
  const user = req.user;

  if (user._id !== userId && user.role !== 'admin') {
    throw new UnauthorizedError('No authorization');
  }

  res.status(StatusCodes.OK).json({ success: true, user: user });
};

export const updateUser = async (req, res) => {
  const userInfo = req.body;
  //get this user object from authenication middleware
  const reqUser = req.user;

  const user = await User.findOne({ _id: reqUser._id });

  //if user wants to update password
  //check if current password matched with the one in DB
  if (userInfo.currentPassword) {
    const isPasswordCorrect = await user?.comparePasswords(
      userInfo.currentPassword
    );
    if (!isPasswordCorrect) {
      throw new BadRequestError('Invalid credentials');
    }
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: reqUser._id },
    userInfo,
    {
      new: true,
      runValidators: true,
    }
  );

  let returnUser = createTokenUser(updatedUser);

  res.status(StatusCodes.OK).json({ success: true, user: returnUser });
};
