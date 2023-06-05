import { Schema, model } from 'mongoose';
import { IProduct } from '../interface/IProduct';

const productSchema = new Schema<IProduct>({
  productId: {
    type: String,
    require: true,
  },
  productName: {
    type: String,
    require: true,
  },
  productCode: {
    type: String,
    require: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['headphone', 'speaker', 'earphones'],
    default: 'headphone',
  },
  price: {
    type: Number,
    require: true,
  },
  image: {
    type: {
      mobile: String,
      tablet: String,
      desktop: String,
    },
  },
  categoryImage: {
    type: {
      mobile: String,
      tablet: String,
      desktop: String,
    },
  },
  isNewProduct: {
    type: Boolean,
    default: false,
  },
  features: String,
  includes: {
    type: [
      {
        quantity: {
          type: Number,
          require: true,
        },
        item: {
          type: Number,
          require: true,
        },
      },
    ],
  },
  gallery: {
    type: [
      {
        mobile: String,
        tablet: String,
        desktop: String,
      },
    ],
  },
  relatedProducts: {
    type: [
      {
        productId: String,
        productName: String,
        image: {
          mobile: String,
          tablet: String,
          desktop: String,
        },
      },
    ],
  },
});

export const Product = model<IProduct>('Product', productSchema);
