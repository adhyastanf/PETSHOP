'use client';

import EmptyAddress from '@/components/Empty/AddressEmpty';
import AddressCardSkeleton from '@/components/Loading/AddressSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from '@/hooks/use-customer';
import { cn } from '@/lib/utils';
import { useAddressStore } from '@/store/address-store';
import { Address, AddressRequest } from '@/types/address-types';
import { Check, HomeIcon, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AddressModalForm from './Form/AddressModalForm';
import { alertDialog } from '@/lib/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddressListProps {
  addresses: Address[];
  isLoading: boolean;
}

interface AddressCardProps {
  address: Address;
}

export default function AddressContainers() {
  const { isOpen, openModal, closeModal } = useAddressStore((state) => state);
  const { data: addresses = [], isLoading: isLoadingAddress } = useAddresses();
  const t = useTranslations();

  function handleOpen() {
    openModal({
      mode: 'create',
      id: null,
    });
  }

  function handleClose() {
    closeModal();
  }

  function handleSubmit(values: AddressRequest) {
    console.log('val : ', values);
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2 border-gray-100'>
          <div className='rounded bg-blue-50 p-3 text-blue-600'>
            <HomeIcon className='size-5' />
          </div>

          <div>
            <h2 className='text-xl font-semibold text-gray-900'>{t('customer.address.title')}</h2>
            <p className='text-xs text-gray-500'>Pastikan alamat makanan & perlengkapan Anabul sudah benar</p>
          </div>
        </div>

        <Button onClick={handleOpen} className='shrink-0 text-white hover:bg-orange-600'>
          <Plus className='size-4' />
          Tambah Alamat Baru
        </Button>
      </div>

      <div className='h-120'>
        <ScrollArea className='h-full w-full'>
          <AddressList addresses={addresses} isLoading={isLoadingAddress} />
        </ScrollArea>

        <AddressModalForm open={isOpen} onClose={handleClose} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

function AddressList({ addresses = [], isLoading }: AddressListProps) {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <AddressCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!addresses.length) {
    return <EmptyAddress />;
  }

  return (
    <div className='space-y-4'>
      {addresses.map((address) => (
        <AddressCard key={address.id} address={address} />
      ))}
    </div>
  );
}

function AddressCard({ address }: AddressCardProps) {
  const { openModal } = useAddressStore((state) => state);
  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: setDefaultAddress } = useSetDefaultAddress();
  const isSelected = address.isDefault;

  const cardStyles = {
    container: cn('relative border-2 transition-all rounded-2xl shadow-sm cursor-pointer', isSelected ? 'border-primary bg-ora-50/30' : 'border-slate-100 bg-white'),
    accentBar: cn('absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl', isSelected ? 'bg-primary' : 'bg-slate-200'),
    badge: 'bg-orange-100 text-orange-700 hover:bg-primary font-medium',
    checkIcon: 'absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white shadow-sm',
  };

  function renderActionIndicator() {
    if (isSelected) {
      return (
        <div className={cardStyles.checkIcon}>
          <Check className='h-3.5 w-3.5' />
        </div>
      );
    }
  }

  function handleDeleteAddress(id: string) {
    alertDialog.confirm({
      title: 'Hapus alamat?',
      description: 'Apakah Anda yakin ingin menghapus alamat ini? Alamat yang dihapus tidak dapat digunakan lagi.',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: () =>
        deleteAddress(id, {
          onSuccess: () =>
            alertDialog.success({
              title: 'Alamat berhasil dihapus',
              description: 'Alamat telah berhasil dihapus dari daftar alamat Anda.',
            }),
        }),
    });
  }

  function handleDefaultAddress(id: string) {
    alertDialog.confirm({
      title: 'Jadikan alamat utama?',
      description: 'Alamat ini akan digunakan sebagai alamat utama untuk pengiriman Anda.',
      confirmText: 'Jadikan Utama',
      cancelText: 'Batal',
      onConfirm: () => setDefaultAddress(id),
    });
  }

  function handleEdit(id: string) {
    openModal({
      mode: 'edit',
      id: id,
    });
  }

  return (
    <Card className={cardStyles.container}>
      <CardContent>
        <div className={cardStyles.accentBar} />
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='font-bold text-lg text-slate-800'>{address.label || 'Alamat'}</span>
              {address.isDefault && (
                <Badge variant='secondary' className={cardStyles.badge}>
                  Utama
                </Badge>
              )}
            </div>
            <div className='space-y-0.5 mb-2'>
              <p className='text-slate-900 font-semibold'>{address.recipientName}</p>
              <p className='text-sm text-slate-500'>{address.recipientPhone}</p>
              <p className='text-sm text-slate-600'>{address.addressLine}</p>
              <p className='text-sm text-slate-500'>
                {address.subdistrictName && `${address.subdistrictName}, `}
                {address.districtName && `${address.districtName}, `}
                {address.cityName && `${address.cityName}, `}
                {address.provinceName && `${address.provinceName}, `}
                {address.postalCode}
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <Button variant='ghost' size='sm' onClick={() => handleEdit(address.id)}>
                Ubah Alamat
              </Button>
              {!address.isDefault && (
                <>
                  <Separator orientation='vertical' className='h-4' />
                  <Button variant='ghost' size='sm' onClick={() => handleDefaultAddress(address.id)}>
                    Jadikan Utama
                  </Button>
                  <Separator orientation='vertical' className='h-4' />
                  <Button variant='ghost' size='sm' onClick={() => handleDeleteAddress(address.id)}>
                    Hapus
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className='ml-4'>{renderActionIndicator()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
