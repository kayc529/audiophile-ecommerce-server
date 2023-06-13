import express from 'express';
import {
  getAllOrders,
  getOrder,
  getUserOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController';
import authentication from '../middleware/authentication';
import { getSession } from '../middleware/session';
const orderRouter = express.Router();

orderRouter.get('/', getAllOrders);
orderRouter.get('/order-history', authentication, getUserOrders);
orderRouter.get('/:id', getOrder);
orderRouter.post('/', getSession, createOrder);
orderRouter.patch('/:id', authentication, updateOrder);
orderRouter.delete('/:id', deleteOrder);

export default orderRouter;
