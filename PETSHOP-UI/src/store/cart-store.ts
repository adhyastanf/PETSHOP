// @/store/use-cart-store.ts
import { CART_ITEMS } from '@/mock/cart';
import { CartItemTypes } from '@/types/cart-types';
import { create, type ExtractState } from 'zustand';

type CartState = {
  data: CartItemTypes[];
};

type CartAction = {
  addCart: (item: CartItemTypes) => void;
  setChecked: (id: number, checked: boolean) => void;
  setQuantity: (id: number, qty: number) => void;
  checkAllGroup: (mitraId: number, checked: boolean) => void;
  checkAllCart: (checked: boolean) => void;
};

type CartStore = CartState & CartAction;

const initialState: CartState = {
  data: CART_ITEMS,
};

export const useCartStore = create<CartStore>((set) => ({
  ...initialState,

  addCart: (newItem) =>
    set((state) => {
      const existingItem = state.data.find((item) => item.product.id === newItem.product.id);

      if (existingItem) {
        return {
          data: state.data.map((item) =>
            item.product.id === newItem.product.id
              ? {
                  ...item,
                  quantity: item.quantity + newItem.quantity,
                }
              : item,
          ),
        };
      }

      return {
        data: [
          ...state.data,
          {
            ...newItem,
            isChecked: true,
          },
        ],
      };
    }),

  setChecked: (id, checked) =>
    set((state) => ({
      data: state.data.map((item) =>
        item.id === id
          ? {
              ...item,
              isChecked: checked,
            }
          : item,
      ),
    })),

  // 3. Mengubah kuantitas langsung via input/counter
  setQuantity: (id, qty) =>
    set((state) => ({
      data: state.data.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
    })),

  checkAllGroup: (mitraId, checked) =>
    set((state) => ({
      data: state.data.map((item) =>
        item.mitra.id === mitraId
          ? {
              ...item,
              isChecked: checked,
            }
          : item,
      ),
    })),
  checkAllCart: (checked) =>
    set((state) => ({
      data: state.data.map((item) => ({
        ...item,
        isChecked: checked,
      })),
    })),
}));

export type CartStoreState = ExtractState<typeof useCartStore>;
