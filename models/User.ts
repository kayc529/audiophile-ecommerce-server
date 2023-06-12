import { Schema, model, Model } from 'mongoose';
import { IUser, IUserMethods } from '../interface/IUser';
import { IAddress } from '../interface/IAddress';
import bcrypt from 'bcryptjs';
import { MAX_NUM_OF_ADDRESSES } from '../utils/constants';

export const addressSchema = new Schema<IAddress>({
  attn: {
    type: String,
    require: true,
  },
  unit: String,
  street: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  postalCode: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  // isDefault: {
  //   type: Boolean,
  //   default: false,
  // },
});

// Create a new Model type that knows about IUserMethods
type UserModel = Model<IUser, {}, IUserMethods>;

// And a schema that knows about IUserMethods
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    defaultAddress: {
      type: addressSchema,
    },
    addresses: {
      type: [addressSchema],
      validate: [
        validateAddressArrayLength,
        `{PATH} exceeds the limit of ${MAX_NUM_OF_ADDRESSES}`,
      ],
      default: [],
    },
    cartId: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
  },
  { timestamps: true }
);

//validate the length of addresses array
function validateAddressArrayLength(arr) {
  return arr.length <= MAX_NUM_OF_ADDRESSES;
}

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//COMPARE PASSWORD METHOD
userSchema.method(
  'comparePasswords',
  async function comparePasswords(enteredPassword) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  }
);

export const User = model<IUser, UserModel>('User', userSchema);
