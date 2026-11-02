// import { AlertDialogOptions, useAlertDialogStore } from '@/store/alert-dialog-store';

import { AlertDialogOptions, useAlertDialogStore } from "@/store/alert-modal-store";

type AlertDialogInput = Omit<AlertDialogOptions, 'variant'>;

export const alertDialog = {
  confirm(options: AlertDialogInput) {
    useAlertDialogStore.getState().show({
      ...options,
      variant: 'confirm',
    });
  },

  success(options: AlertDialogInput) {
    useAlertDialogStore.getState().show({
      ...options,
      variant: 'success',
    });
  },

  error(options: AlertDialogInput) {
    useAlertDialogStore.getState().show({
      ...options,
      variant: 'error',
    });
  },

  warning(options: AlertDialogInput) {
    useAlertDialogStore.getState().show({
      ...options,
      variant: 'warning',
    });
  },

  info(options: AlertDialogInput) {
    useAlertDialogStore.getState().show({
      ...options,
      variant: 'info',
    });
  },
};
