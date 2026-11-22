'use client';

import EmptyAddress from '@/components/Empty/AddressEmpty';
import ApiErrorState from '@/components/Feedback/ApiErrorState';
import AddressCardSkeleton from '@/components/Loading/AddressSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from '@/hooks/use-customer';
import { alertDialog } from '@/lib/alert-dialog';
import { cn } from '@/lib/utils';
import { useAddressStore } from '@/store/address-store';
import type { Address } from '@/types/address-types';
import { HomeIcon, MapPinIcon, PawPrintIcon, Pencil, PinIcon, Plus, Star, StarIcon, Trash2, UserIcon, VerifiedIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AddressModalForm from './Form/AddressModalForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const SKELETON_COUNT = 3;
// const MAX_VISIBLE_ADDRESSES = 3;

export default function AddressContainers() {
  const t = useTranslations();
  const { isOpen, openModal, closeModal } = useAddressStore((state) => state);

  const { data: addresses = [], isLoading, isError, refetch, isRefetching } = useAddresses();

  const handleAdd = () => {
    openModal({ mode: 'create', id: null });
  };

  return (
    <div>
      <div className='flex flex-col space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <HomeIcon className='size-5' aria-hidden='true' />
            </div>

            <div className='flex flex-col gap-0.5'>
              <h2 className='text-h3 text-foreground'>{t('customer.address.title')}</h2>
              <p className='text-small text-muted-foreground'>{t('customer.address.description')}</p>
            </div>
          </div>

          <Button onClick={handleAdd} className='w-full sm:w-auto'>
            <Plus data-icon='inline-start' aria-hidden='true' />
            {t('address.newAddress')}
          </Button>
        </div>

        {isError ? <ApiErrorState onRetry={() => void refetch()} isRetrying={isRefetching} /> : <AddressList addresses={addresses} isLoading={isLoading} onAdd={handleAdd} />}
      </div>
      <AddressModalForm open={isOpen} onClose={closeModal} />
    </div>
  );
}

type AddressListProps = {
  addresses: Address[];
  isLoading: boolean;
  onAdd: () => void;
};

function AddressList({ addresses, isLoading, onAdd }: AddressListProps) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <AddressCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return <EmptyAddress onAdd={onAdd} />;
  }

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex flex-col h-120'>
        <ScrollArea className='h-full'>
          <div className='space-y-3'>{[...Array(5)].flatMap((_, i) => addresses.map((address) => <AddressCard key={`${address.id}-${i}`} address={address} />))}</div>
        </ScrollArea>
      </div>

      <p className='text-sm text-muted-foreground'>{t('customer.address.listHint')}</p>
    </div>
  );
}

type AddressCardProps = {
  address: Address;
};

function AddressCard({ address }: AddressCardProps) {
  const t = useTranslations();
  const { openModal } = useAddressStore((state) => state);

  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: setDefaultAddress } = useSetDefaultAddress();

  const isDefault = address.isDefault;

  const handleEdit = () => {
    openModal({ mode: 'edit', id: address.id });
  };

  const handleDelete = () => {
    alertDialog.confirm({
      title: t('address.confirm.deleteTitle'),
      description: t('address.confirm.deleteDescription'),
      confirmText: t('address.deleteAction'),
      cancelText: t('common.cancel'),
      onConfirm: () => {
        deleteAddress(address.id, {
          onSuccess: () => {
            alertDialog.success({
              title: t('address.success.deletedTitle'),
              description: t('address.success.deletedDescription'),
            });
          },
        });
      },
    });
  };

  const handleSetDefault = () => {
    alertDialog.confirm({
      title: t('address.confirm.setDefaultTitle'),
      description: t('address.confirm.setDefaultDescription'),
      confirmText: t('address.setDefault'),
      cancelText: t('common.cancel'),
      onConfirm: () => setDefaultAddress(address.id),
    });
  };

  return (
    <Card variant={isDefault ? 'selected' : 'default'} className={cn(isDefault && 'border-l-4 border-l-primary')}>
      <CardHeader className='flex w-full flex-col gap-2'>
        <div className='flex items-center justify-between w-full gap-2'>
          <div className='flex items-center gap-2'>
            {isDefault && (
              <Badge variant='default'>
                <StarIcon className='inline-start' />
                {t('address.default')}
              </Badge>
            )}

            <CardTitle className='text-sm font-semibold'>{address.label || t('address.unnamed')}</CardTitle>
          </div>

          <Badge variant='secondary' className='text-xs'>
            {isDefault ? (
              <>
                <VerifiedIcon className='inline-start' />
                Alamat Pengiriman Default
              </>
            ) : (
              'Alamat Sekunder'
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='flex flex-col gap-3'>
        <AddressInformation address={address} />
        <AddressNotes notes={address.notes} />
        <AddressCardActions isDefault={isDefault} onEdit={handleEdit} onDelete={handleDelete} onSetDefault={handleSetDefault} />
      </CardContent>
    </Card>
  );
}

function AddressInformation({ address }: { address: Address }) {
  return (
    <div className='flex w-full flex-col gap-1'>
      <div className='flex items-center gap-1'>
        <UserIcon className='size-4 shrink-0' color='red' aria-hidden='true' />
        <p className='font-semibold text-foreground'>
          {address.recipientName} - <span>{address.recipientPhone}</span>
        </p>
      </div>
      <div className='flex items-center gap-1'>
        <MapPinIcon className='size-4 shrink-0' color='red' aria-hidden='true' />
        <CardDescription className='wrap-break-words'>{address.addressLine}</CardDescription>
      </div>
    </div>
  );
}

function AddressNotes({ notes }: { notes?: string | null }) {
  return (
    <div className='flex w-full items-start gap-2 rounded-lg bg-secondary px-3 py-3'>
      <PinIcon className='mt-0.5 size-4 shrink-0' color='red' aria-hidden='true' />
      <div className='min-w-0'>
        <p className='text-xs font-semibold text-primary'>PATOKAN & CATATAN</p>
        <p className='wrap-break-words'>{notes || 'Tidak ada catatan'}</p>
      </div>
    </div>
  );
}

type AddressCardActionsProps = {
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
};

function AddressCardActions({ isDefault, onEdit, onDelete, onSetDefault }: AddressCardActionsProps) {
  const t = useTranslations();

  return (
    <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
      {isDefault ? (
        <div className='flex items-center gap-1 text-sm font-medium text-primary'>
          <PawPrintIcon className='size-4 text-primary' aria-hidden='true' />
          <p>Digunakan otomatis saat checkout</p>
        </div>
      ) : (
        <Button type='button' variant='secondary' onClick={onSetDefault}>
          <Star data-icon='inline-start' aria-hidden='true' />
          {t('address.setDefault')}
        </Button>
      )}

      <div className='flex flex-wrap items-center gap-2'>
        <Button type='button' onClick={onEdit}>
          <Pencil data-icon='inline-end' aria-hidden='true' />
          {t('address.editAddress')}
        </Button>

        {!isDefault && (
          <Button type='button' variant='secondary' onClick={onDelete}>
            <Trash2 data-icon='inline-start' aria-hidden='true' />
            {t('address.deleteAction')}
          </Button>
        )}
      </div>
    </div>
  );
}
