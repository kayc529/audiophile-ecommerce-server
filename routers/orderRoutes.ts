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
const orderRouter = express.Router();

orderRouter.get('/', getAllOrders);
orderRouter.get('/order-history', authentication, getUserOrders);
orderRouter.get('/:id', getOrder);
orderRouter.post('/', createOrder);
orderRouter.patch('/:id', authentication, updateOrder);
orderRouter.delete('/:id', deleteOrder);

export default orderRouter;
