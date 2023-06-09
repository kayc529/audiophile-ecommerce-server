import { Order } from '../models/Order';
import { Sequence } from '../models/Sequence';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, UnauthorizedError } from '../error';

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ success: true, orders });
};

export const getOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  res.status(StatusCodes.OK).json({ success: true, order });
};

export const getUserOrders = async (req, res) => {
  const user = req.user;

  const orders = await Order.find({ customerId: user.userId }).sort({
    createdAt: -1,
  });

  res.status(StatusCodes.OK).json({ success: true, orders });
};

//auto-increase orderId by 1 for the next order
const getNextOrderId = async () => {
  const sequenceDoc = await Sequence.findOneAndUpdate(
    { _id: 'orderId' },
    { $inc: { sequence: 1 } },
    { new: true }
  );

  return sequenceDoc.sequence;
};

export const createOrder = async (req, res) => {
  const order = req.body;
  const nextOrderId = await getNextOrderId();

  const newOrder = await Order.create({ ...order, orderId: nextOrderId });

  res.status(StatusCodes.CREATED).json({ success: true, order: newOrder });
};

export const updateOrder = async (req, res) => {
  const newOrder = req.body;
  const { id: orderId } = req.params;
  const user = req.user;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (user.userId !== newOrder.customerId && user.role !== 'ADMIN') {
    throw new UnauthorizedError('No authorization');
  }

  const updatedOrder = await Order.findOneAndUpdate(
    { _id: orderId },
    newOrder,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ success: true, order: updatedOrder });
};

export const deleteOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  await Order.findOneAndDelete({ _id: orderId });

  res.status(StatusCodes.OK).json({ success: true });
};
