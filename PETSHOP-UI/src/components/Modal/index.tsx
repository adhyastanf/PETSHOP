import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AppModalProps {
  trigger?: React.ReactElement;
  open?: boolean;
  onClose?: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ trigger, open, onClose, title, description, children, maxWidth = 'sm:max-w-[600px]' }: AppModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger render={trigger} />
      <DialogContent className={`${maxWidth} max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl`}>
        <DialogHeader className='px-6 pt-6 border-slate-100 shrink-0 bg-white'>
          <DialogTitle className='text-2xl font-bold text-slate-900'>{title}</DialogTitle>
          {description && <DialogDescription className='text-xs text-slate-500'>{description}</DialogDescription>}
        </DialogHeader>

        <div className='px-6 pb-4 overflow-y-auto flex-1'>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
