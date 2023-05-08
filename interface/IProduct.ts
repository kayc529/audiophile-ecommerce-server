import { Document } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  productName: string;
  productCode: string;
  description?: string;
  category: string;
  price: number;
  image?: IProductPhoto;
  categoryImage?: IProductPhoto;
  isNewProduct: boolean;
  features?: string;
  includes?: IProductAccessory[];
  gallery?: IProductPhoto[];
  relatedProducts?: IRelatedProducts[];
}

interface IProductPhoto {
  mobile: string;
  tablet: string;
  desktop: string;
}

interface IProductAccessory {
  item: string;
  quantity: number;
}

interface IRelatedProducts {
  productId: string;
  productName: string;
  image: IProductPhoto;
}
