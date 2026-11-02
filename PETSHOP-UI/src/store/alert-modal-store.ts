import { create } from 'zustand';

export type AlertDialogVariant = 'confirm' | 'success' | 'error' | 'warning' | 'info';

export type AlertDialogOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: AlertDialogVariant;
  onConfirm?: () => void | Promise<void>;
};

type AlertDialogState = {
  open: boolean;
  options: AlertDialogOptions | null;
  show: (options: AlertDialogOptions) => void;
  close: () => void;
};

export const useAlertDialogStore = create<AlertDialogState>((set) => ({
  open: false,
  options: null,

  show: (options) => {
    set({
      open: true,
      options,
    });
  },

  close: () => {
    set({
      open: false,
      options: null,
    });
  },
}));
