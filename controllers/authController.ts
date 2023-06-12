import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { createTokenUser } from '../utils/createTokenUser';
import crypto from 'crypto';
import { attachCookieToResponse } from '../utils/jwt';
import { BadRequestError } from '../error';
import { Cart } from '../models/Cart';
import { Session } from '../models/Session';
import { mergeCartItems } from '../utils/cartItemsHelper';
import { ICart } from '../interface/ICart';
import { ICartItem } from '../interface/ICartItem';

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    defaultAddress,
    role,
  } = req.body;
  const sessionId = req.sessionId;

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
    defaultAddress,
    role,
  });

  //linked session with the user
  await Session.findOneAndUpdate({ sessionId }, { user: user._id });

  //link cart to user
  const cart = await Cart.findOne({ sessionId }).select({ sessionId: 0 });
  user.cartId = cart._id;
  await user.save();

  //create token user
  const tokenUser = createTokenUser(user);

  //generate refresh token
  const refreshToken = crypto.randomBytes(40).toString('hex');

  //attach cookie to response
  attachCookieToResponse({ res, user: tokenUser, refreshToken });

  //return user's data and cart
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, user: tokenUser, cart });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const sessionId = req.sessionId;

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePasswords(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError('Invalid credentials');
  }
  //link this session to the user
  await Session.findOneAndUpdate({ sessionId: sessionId }, { user: user._id });

  //get the cart that is linked to this session
  let cart = await Cart.findOne({ sessionId });

  //if user has a cart linked to their account before
  //just in case refreshToken expired, user was forced to logout
  //but the session hasn't expire yet
  if (user.cartId && user.cartId !== cart._id) {
    const existingCart = await Cart.findOne({ _id: user.cartId });
    if (existingCart) {
      //merge items from the existing cart into the new cart
      const mergedCart = mergeCartItems(existingCart.items, cart.items);
      cart.items = mergedCart;
      await cart.save();
      //delete the old cart
      await Cart.findOneAndDelete({ _id: existingCart._id });
    }
  }

  //update the user's cart id
  user.cartId = cart._id;
  await user.save();

  const tokenUser = createTokenUser(user);
  const refreshToken = crypto.randomBytes(40).toString('hex');
  attachCookieToResponse({ res, user: tokenUser, refreshToken });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, user: tokenUser, cart: cart });
};

export const logout = async (req, res) => {
  //expire session
  res.cookie('sid', '', {
    httpOnly: true,
    signed: true,
    maxAge: -1,
  });

  //expire access token
  res.cookie('accessToken', '', {
    httpOnly: true,
    signed: true,
    maxAge: -1,
  });

  //expire refresh token
  res.cookie('refreshToken', '', {
    httpOnly: true,
    signed: true,
    maxAge: -1,
  });

  res.status(StatusCodes.OK).json({ success: true });
};
