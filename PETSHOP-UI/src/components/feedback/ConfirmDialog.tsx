'use client';

import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  children: (open: () => void) => React.ReactNode;
}

/**
 * Reusable confirmation dialog for destructive actions.
 * Follows DESIGN_SYSTEM.md Modal & Dialog Guidelines.
 */
export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  loading = false,
  children,
}: ConfirmDialogProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const resolvedConfirmLabel = confirmLabel ?? t('common.delete');
  const resolvedCancelLabel = cancelLabel ?? t('common.cancel');

  function handleConfirm() {
    onConfirm();
    setIsOpen(false);
  }

  return (
    <>
      {children(() => setIsOpen(true))}

      {isOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/50 animate-in fade-in-0 duration-200'
            onClick={() => !loading && setIsOpen(false)}
          />

          {/* Dialog */}
          {/* whitespace-normal resets any inherited `whitespace-nowrap` from an
              ancestor (e.g. a table cell) so the text wraps within the card. */}
          <div className='relative z-10 mx-4 w-full max-w-sm rounded-xl bg-card p-6 shadow-xl whitespace-normal animate-in fade-in-0 zoom-in-95 duration-200'>
            <div className='flex w-full flex-col items-center gap-3 text-center'>
              <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-destructive/10'>
                <TriangleAlert className='size-6 text-destructive' />
              </div>
              <h2 className='w-full text-lg font-semibold break-words'>{title}</h2>
              <p className='w-full text-sm text-muted-foreground break-words'>{description}</p>
            </div>

            <div className='mt-6 flex gap-3 justify-end'>
              <Button
                variant='outline'
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                {resolvedCancelLabel}
              </Button>
              <Button
                variant='destructive'
                onClick={handleConfirm}
                loading={loading}
              >
                {resolvedConfirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
