export type CartItem = {
  productId: string;
  qty: number;
  price: number;
};

export type CartItemTypes = {
  id: number;
  quantity: number;
  mitra: MitraTypes;
  product: ProductTypes;
  isChecked ?: boolean;
};

export type MitraTypes = {
  id: number;
  name: string;
  city: string;
  isOfficialStore: boolean;
};

export type ProductTypes = {
  id: number;
  name: string;
  price: number;
  sku: string;
  imageUrl: string;
};
