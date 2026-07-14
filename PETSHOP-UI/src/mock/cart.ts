// @/mock/cart.ts
import { CartItemTypes } from '@/types/cart-types';

export const CART_ITEMS: CartItemTypes[] = [
  // ==========================================
  // MITRA 1: Petshop Bandung (Official Store)
  // ==========================================
  {
    id: 1,
    quantity: 1,
    isChecked: true,
    mitra: {
      id: 1,
      name: 'Petshop Bandung',
      city: 'Bandung',
      isOfficialStore: true,
    },
    product: {
      id: 101,
      name: 'Foom Red Apple Salt Nic 30ml',
      price: 85000,
      sku: 'FOM-RED-APP-30',
      imageUrl: 'https://images.unsplash.com/photo-1511688868355-7216ee30bc32?w=150',
    },
  },
  {
    id: 2,
    quantity: 2,
    isChecked: true,
    mitra: {
      id: 1,
      name: 'Petshop Bandung',
      city: 'Bandung',
      isOfficialStore: true,
    },
    product: {
      id: 102,
      name: 'Royal Canin Persian Adult 2kg',
      price: 320000,
      sku: 'RC-PERSIAN-2KG',
      imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=150',
    },
  },

  // ==========================================
  // MITRA 2: Petshop Jakarta (Regular Store)
  // ==========================================
  {
    id: 3,
    quantity: 1,
    isChecked: false,
    mitra: {
      id: 2,
      name: 'Petshop Jakarta',
      city: 'Jakarta Selatan',
      isOfficialStore: false,
    },
    product: {
      id: 103,
      name: 'Whiskas Tuna Adult 1.2kg',
      price: 125000,
      sku: 'WHK-TUNA-1KG',
      imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=150',
    },
  },
  {
    id: 4,
    quantity: 3,
    isChecked: false,
    mitra: {
      id: 2,
      name: 'Petshop Jakarta',
      city: 'Jakarta Selatan',
      isOfficialStore: false,
    },
    product: {
      id: 104,
      name: 'Kalung Kucing Premium Bell',
      price: 45000,
      sku: 'ACC-CAT-BELL',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150',
    },
  },

  // ==========================================
  // MITRA 3: Meow Surabaya Pet Center
  // ==========================================
  {
    id: 5,
    quantity: 1,
    isChecked: true,
    mitra: {
      id: 3,
      name: 'Meow Surabaya Pet Center',
      city: 'Surabaya',
      isOfficialStore: true,
    },
    product: {
      id: 105,
      name: 'Minyak Ikan Vitamin Kucing 50 Softgel',
      price: 65000,
      sku: 'VIT-FISH-OIL-50',
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150',
    },
  },
  {
    id: 6,
    quantity: 1,
    isChecked: false,
    mitra: {
      id: 3,
      name: 'Meow Surabaya Pet Center',
      city: 'Surabaya',
      isOfficialStore: true,
    },
    product: {
      id: 106,
      name: 'Pasir Kucing Gumpal Bento 10L',
      price: 78000,
      sku: 'PASIR-BENTO-10L',
      imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=150',
    },
  },

  // ==========================================
  // MITRA 4: Doggy & Catty Medan
  // ==========================================
  {
    id: 7,
    quantity: 5,
    isChecked: true,
    mitra: {
      id: 4,
      name: 'Doggy & Catty Medan',
      city: 'Medan',
      isOfficialStore: false,
    },
    product: {
      id: 107,
      name: 'Wet Food Kucing Snappy Tom 400g',
      price: 22000,
      sku: 'WF-SNAPPY-400G',
      imageUrl: 'https://images.unsplash.com/photo-1574158622643-69d34d72650f?w=150',
    },
  },
];
