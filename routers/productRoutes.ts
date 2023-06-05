import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
const express = require('express');
const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.post('/', createProduct);
productRouter.get('/:id', getProduct);
productRouter.patch('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;
