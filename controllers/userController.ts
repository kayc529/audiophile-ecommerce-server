import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../error';
import { createTokenUser } from '../utils/createTokenUser';

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ success: true, users });
};

export const getUser = async (req, res) => {
  const { id: userId } = req.params;
  const reqUser = req.user;

  if (reqUser.userId !== userId && reqUser.role !== 'ADMIN') {
    throw new UnauthorizedError('No authorization');
  }

  let user = await User.findOne({ _id: userId });

  //remove user's password field
  delete user.password;

  res.status(StatusCodes.OK).json({ success: true, user: user });
};

export const updateUser = async (req, res) => {
  const userInfo = req.body;
  const { id: userId } = req.params;
  //get this user object from authenication middleware
  const reqUser = req.user;

  if (reqUser.userId !== userId && reqUser.role !== 'ADMIN') {
    throw new UnauthorizedError('No authorization');
  }

  const user = await User.findOne({ _id: userId });

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
    { _id: userId },
    { ...userInfo },
    {
      new: true,
      runValidators: true,
    }
  );

  let returnUser = createTokenUser(updatedUser);

  res.status(StatusCodes.OK).json({ success: true, user: returnUser });
};

export const deleteUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await User.findOneAndDelete({ _id: userId });

  res.status(StatusCodes.OK).json({ success: true });
};
