import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { createTokenUser } from '../utils/createTokenUser';
import crypto from 'crypto';
import { attachCookieToResponse } from '../utils/jwt';

export const register = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    //throw error
    return;
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  });

  //create token user
  const tokenUser = createTokenUser(user);

  //generate refresh token
  const refreshToken = crypto.randomBytes(40).toString('hex');

  //attach cookie to response
  attachCookieToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.CREATED).json({ success: true });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    //throw error
    return;
  }

  const isPasswordCorrect = await user.comparePasswords(password);

  if (!isPasswordCorrect) {
    //throw error
    return;
  }
};
