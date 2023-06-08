import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../error';
import { createTokenUser } from '../utils/createTokenUser';

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ success: true, users });
};

export const getUser = async (req, res) => {
  const { id: userId } = req.params;
  const reqUser = req.user;

  if (reqUser.userId !== userId && reqUser.role !== 'ADMIN') {
    throw new UnauthorizedError('No authorization');
  }

  //find user without password
  let user = await User.findOne({ _id: userId }, { password: 0 });

  res.status(StatusCodes.OK).json({ success: true, user: user });
};

export const getUserAddress = async (req, res) => {
  const { id: userId } = req.params;
  const reqUser = req.user;

  if (reqUser.userId !== userId && reqUser.role !== 'ADMIN') {
    throw new UnauthorizedError('No authorization');
  }

  const user = await User.findOne(
    { _id: userId },
    { defaultAddress: 1, addresses: 1 }
  );

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.status(StatusCodes.OK).json({ success: true, user });
};

export const updateUser = async (req, res) => {
  const userInfo = req.body;
  const { id: userId } = req.params;
  //get this user object from authenication middleware
  const reqUser = req.user;

  if (reqUser.userId !== userId && reqUser.role !== 'ADMIN') {
    throw new UnauthorizedError('No authorization');
  }

  const user = await User.findOne({ _id: userId });

  //if user wants to update password
  //check if current password matched with the one in DB
  if (userInfo.currentPassword) {
    const isPasswordCorrect = await user?.comparePasswords(
      userInfo.currentPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError('Invalid credentials');
    }

    user.password = userInfo.password;
    await user.save();
  }

  delete userInfo.password;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { ...userInfo },
    {
      new: true,
      runValidators: true,
    }
  );

  let returnUser = createTokenUser(updatedUser);

  res.status(StatusCodes.OK).json({ success: true, user: returnUser });
};

export const updateAddress = async (req, res) => {
  let { address } = req.body;
  const reqUser = req.user;

  let user = null;

  if (address._id) {
    //if the user updates an existing address
    user = await User.findOneAndUpdate(
      { _id: reqUser.userId, 'addresses._id': address._id },
      {
        $set: { 'addresses.$': address },
      },
      { new: true, projection: { _id: 1, defaultAddress: 1, addresses: 1 } }
    );

    //if the updated address is the default address
    //also update the default address
    if (address._id && address._id === user.defaultAddress._id) {
      user.defaultAddress = user.addresses[0];
    }
  } else {
    //if the user added a new address
    user = await User.findOneAndUpdate(
      { _id: reqUser.userId },
      {
        $addToSet: { addresses: address },
      },
      { new: true, projection: { _id: 1, defaultAddress: 1, addresses: 1 } }
    );

    //if the user added an address for the first time
    //the default address will be set to the first address
    if (user.addresses.length === 1) {
      user.defaultAddress = user.addresses[0];
    }
  }

  await user.save();

  res.status(StatusCodes.OK).json({ success: true, user });
};

export const deleteAddress = async (req, res) => {
  const { id: addressId } = req.params;
  const reqUser = req.user;

  const user = await User.findOneAndUpdate(
    { _id: reqUser.userId },
    {
      $pull: { addresses: { _id: addressId } },
    },
    {
      new: true,
      projection: { _id: 1, defaultAddress: 1, addresses: 1 },
    }
  );

  if (user.defaultAddress._id.toString() === addressId) {
    //if no more saved addresses after removal
    if (user.addresses.length === 0) {
      user.defaultAddress = undefined;
    } else {
      //set defaultAddress to the next saved address
      user.defaultAddress = user.addresses[0];
    }

    await user.save();
  }

  res.status(StatusCodes.OK).json({ success: true, user });
};

export const deleteUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await User.findOneAndDelete({ _id: userId });

  res.status(StatusCodes.OK).json({ success: true });
};
