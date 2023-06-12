import { ICartItem } from '../interface/ICartItem';

export const mergeCartItems = (
  cart1: ICartItem[],
  cart2: ICartItem[]
): ICartItem[] => {
  let mergedCartMap = {};

  cart1.forEach((item) => {
    const { productId, productCode, quantity, thumbnail, price } = item;
    if (!mergedCartMap[productId]) {
      mergedCartMap[productId] = {
        productId,
        productCode,
        quantity,
        thumbnail,
        price,
      };
    }
  });

  cart2.forEach((item) => {
    const { productId, productCode, quantity, thumbnail, price } = item;
    if (!mergedCartMap[productId]) {
      mergedCartMap[productId] = {
        productId,
        productCode,
        quantity,
        thumbnail,
        price,
      };
    } else {
      mergedCartMap[productId].quantity += item.quantity;
    }
  });

  const mergedCart = Object.values(mergedCartMap);
  return mergedCart as ICartItem[];
};
