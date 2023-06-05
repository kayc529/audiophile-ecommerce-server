import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { createTokenUser } from '../utils/createTokenUser';
import crypto from 'crypto';
import { attachCookieToResponse } from '../utils/jwt';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../error';

export const register = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('User already registered');
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

  res.status(StatusCodes.CREATED).json({ success: true, user: tokenUser });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('Invalid crudentials');
  }

  const isPasswordCorrect = await user.comparePasswords(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError('Invalid crudentials');
  }

  const tokenUser = createTokenUser(user);

  const refreshToken = crypto.randomBytes(40).toString('hex');

  attachCookieToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.CREATED).json({ success: true, user: tokenUser });
};

export const logout = async (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    signed: true,
    maxAge: -1,
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    signed: true,
    maxAge: -1,
  });
  res.status(StatusCodes.OK).json({ success: true });
};
