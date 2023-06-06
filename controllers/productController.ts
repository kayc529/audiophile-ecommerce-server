import { StatusCodes } from 'http-status-codes';
import { Product } from '../models/Product';
import { NotFoundError } from '../error';

export const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ success: true, products });
};

export const getProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({
    $or: [{ _id: productId }, { productId: productId }],
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  res.status(StatusCodes.OK).json({ success: true, product });
};

export const createProduct = async (req, res) => {
  const productObj = req.body;
  const product = await Product.create(productObj);

  res.status(StatusCodes.CREATED).json({ success: true, product });
};

export const updateProduct = async (req, res) => {
  const productObj = req.body;

  const product = await Product.findOne({
    $or: [{ _id: productObj._id }, { productId: productObj._id }],
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  const updatedProduct = await Product.findOneAndUpdate(
    {
      $or: [{ _id: productObj._id }, { productId: productObj._id }],
    },
    productObj,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ success: true, product: updatedProduct });
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findOneAndDelete({
    $or: [{ _id: productId }, { productId: productId }],
  });

  res.status(StatusCodes.OK).json({ success: true });
};
