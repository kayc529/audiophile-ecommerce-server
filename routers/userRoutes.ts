import express from 'express';
import {
  getAllUsers,
  getUser,
  getUserAddress,
  updateUser,
  updateAddress,
  deleteUser,
  deleteAddress,
} from '../controllers/userController';
import authentication from '../middleware/authentication';
const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/addresses/:id', authentication, getUserAddress);
userRouter.get('/:id', authentication, getUser);
userRouter.patch('/addresses/:id', authentication, updateAddress);
userRouter.patch('/:id', authentication, updateUser);
userRouter.delete('/addresses/:id', authentication, deleteAddress);
userRouter.delete('/:id', deleteUser);

export default userRouter;
