import express from 'express';
import { getCart, updateCart, deleteCart } from '../controllers/cartController';
import { getSession } from '../middleware/session';
const cartRouter = express.Router();

cartRouter.get('/', getSession, getCart);
cartRouter.patch('/', getSession, updateCart);
cartRouter.delete('/:id', deleteCart);

export default cartRouter;
