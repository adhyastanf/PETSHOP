export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  isActive: boolean;
  ratingAvg: number;
  ratingCount: number;
  soldCount: number;
  categoryName: string;
  petshopName: string;
  petshopId: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  iconUrl: string | null;
  sortOrder: number;
}

export interface PetshopInfo {
  id: number;
  shopName: string;
  description: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  isVerified: boolean;
  ratingAvg: number;
  ratingCount: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
