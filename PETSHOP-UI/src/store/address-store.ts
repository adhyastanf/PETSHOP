import { create, ExtractState } from 'zustand';

type modeType = 'create' | 'edit';

export interface AddressState {
  addressId: string | null;
  mode: modeType | null;
  isOpen: boolean;
  setMode: (mode: modeType | null) => void;
  openModal: ({ mode, id }: { mode: modeType; id?: string | null }) => void;
  closeModal: () => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  addressId: null,
  mode: null,
  isOpen: false,
  setMode: (mode) => set({ mode }),
  openModal: ({ mode, id }) =>
    set({
      isOpen: true,
      mode,
      addressId: id,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      mode: null,
      addressId: null,
    }),
}));

export type AddressStoreType = ExtractState<typeof useAddressStore>;
