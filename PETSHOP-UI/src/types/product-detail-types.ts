type ProductVariantColor = {
  id: string;
  name: string;
};

type ProductSpecification = {
  label: string;
  value: string;
};

type ProductSeller = {
  id: string;
  name: string;
  rating: number;
  followers: number;
};

export type ProductDetailTypes = {
  id: string;
  slug: string;
  name: string;
  description: string;

  brand: string;
  category: string;

  price: number;
  originalPrice: number;
  discount: number;

  rating: number;
  totalReviews: number;
  sold: number;

  stock: number;
  sku: string;

  images: string[];

  variants: {
    color: ProductVariantColor[];
    size: number[];
  };

  specifications: ProductSpecification[];

  features: string[];

  seller: ProductSeller;
};
