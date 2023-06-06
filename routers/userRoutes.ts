import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import authentication from '../middleware/authentication';
const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', authentication, getUser);
userRouter.patch('/:id', authentication, updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
