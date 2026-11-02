import { create, ExtractState } from 'zustand';

type modeType = 'create' | 'edit';

export interface PetsState {
  petsId: string | null;
  mode: modeType | null;
  isOpen: boolean;
  setMode: (mode: modeType | null) => void;
  openModal: ({ mode, id }: { mode: modeType; id?: string | null }) => void;
  closeModal: () => void;
}

export const usePetsStore = create<PetsState>((set) => ({
  petsId: null,
  mode: null,
  isOpen: false,
  setMode: (mode) => set({ mode }),
  openModal: ({ mode, id = null }) =>
    set({
      isOpen: true,
      mode,
      petsId: id,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      mode: null,
      petsId: null,
    }),
}));

export type PetsStoreType = ExtractState<typeof usePetsStore>;
