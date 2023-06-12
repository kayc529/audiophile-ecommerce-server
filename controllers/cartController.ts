import { Cart } from '../models/Cart';
import { Session } from '../models/Session';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../error';

export const getCart = async (req, res) => {
  const sessionId = req.sessionId;

  const existingCart = await Cart.findOne({ sessionId: sessionId }).select(
    '_id items createdAt'
  );

  //if a previous cart is created for this session
  if (existingCart) {
    res.status(StatusCodes.OK).json({ success: true, cart: existingCart });
    return;
  }

  //new session: create new session and cart objects
  await Session.create({ sessionId });
  const newCart = await Cart.create({ sessionId });

  res.status(StatusCodes.OK).json({
    success: true,
    cart: {
      _id: newCart._id,
      items: newCart.items,
      createdAt: newCart.createdAt,
    },
  });
};

export const updateCart = async (req, res) => {
  const newCart = req.body;
  const sessionId = req.sessionId;

  const cart = await Cart.findOne({ _id: newCart._id, sessionId });
  if (!cart) {
    throw new NotFoundError('Cart not found');
  }

  cart.items = newCart.items;
  await cart.save();

  res.status(StatusCodes.OK).json({ success: true, cart });
};

export const deleteCart = async (req, res) => {
  const { id: cartId } = req.params;
  await Cart.findOneAndDelete({ _id: cartId });
  res.status(StatusCodes.OK).json({ success: true });
};
