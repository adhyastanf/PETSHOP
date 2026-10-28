'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAlertDialogStore } from '@/store/alert-modal-store';
import { AlertCircle, CheckCircle2, CircleHelp, Info, TriangleAlert } from 'lucide-react';

export function AppAlertDialog() {
  const { open, options, close } = useAlertDialogStore();

  if (!options) {
    return null;
  }

  const { title, description, confirmText = 'OK', cancelText = 'Batal', variant = 'confirm', onConfirm = () => {} } = options;

  const isConfirmDialog = variant === 'confirm';

  async function handleConfirm() {
    await onConfirm();
    close();
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      close();
    }
  }

  function renderIcon() {
    switch (variant) {
      case 'confirm':
        return <CircleHelp className='size-8' />;

      case 'success':
        return <CheckCircle2 className='size-8' />;

      case 'error':
        return <AlertCircle className='size-8' />;

      case 'warning':
        return <TriangleAlert className='size-8' />;

      case 'info':
        return <Info className='size-8' />;

      default:
        return null;
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className='w-125 max-w-125 sm:max-w-125'>
        <AlertDialogHeader className='flex flex-col justify-center py-5'>
          <div className='flex w-full items-center justify-center'>
            <div className='flex size-14 items-center justify-center rounded-full bg-orange-100'>{renderIcon()}</div>
          </div>
          <AlertDialogTitle className='text-center w-full text-xl'>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription className='w-full text-center'>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter className='flex-row justify-center gap-3 sm:justify-center bg-white border-t-0 pt-0'>
          {isConfirmDialog && <AlertDialogCancel className='flex-1 py-5'>{cancelText}</AlertDialogCancel>}
          <AlertDialogAction onClick={handleConfirm} className='flex-1 py-5'>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
