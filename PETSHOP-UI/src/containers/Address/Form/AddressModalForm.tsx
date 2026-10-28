'use client';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAddress, useCreateAddress, useUpdateAddress } from '@/hooks/use-customer';
import { alertDialog } from '@/lib/alert-dialog';
import { addressFormSchema, AddressFormSchema } from '@/lib/schema/address-schema';
import { useAddressStore } from '@/store/address-store';
import { AddressRequest } from '@/types/address-types';
import { onlyNumbers } from '@/utils/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type AddressFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: AddressRequest) => void;
};

export default function AddressModalForm({ open = false, onClose = () => {}, onSubmit = () => {} }: AddressFormModalProps) {
  const { mode, addressId } = useAddressStore((state) => state);
  const { mutate: createAddress, isPending: loadingSubmitAddress } = useCreateAddress();
  const { mutate: updateAddress, isPending: loadingUpdateAddress } = useUpdateAddress();
  const { data: addressDetail } = useAddress(addressId);
  const t = useTranslations();
  const TITLE_TEXT = mode === 'edit' ? 'Edit Alamat' : 'Tambah Alamat';
  const DESC_TEXT = mode === 'edit' ? 'Perbarui detail alamat pengiriman anabul Anda.' : 'Lengkapi detail alamat pengiriman anabul Anda.';
  const SUBMIT_TEXT = mode === 'edit' ? 'Perbarui Alamat' : t('address.submit');

  const isLoadingAddress = loadingSubmitAddress || loadingUpdateAddress;

  const {
    handleSubmit: handleAddressSubmit,
    control: addressControl,
    reset,
    setValues,
  } = useForm<AddressFormSchema>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: EMPTY_ADDRESS_FORM,
  });

  function onAddressSubmit(data: AddressFormSchema) {
    const payload: AddressRequest = {
      ...data,
      label: data.label ?? null,
      provinceCode: data.provinceCode ?? null,
      provinceName: data.provinceName ?? null,
      cityCode: data.cityCode ?? null,
      cityName: data.cityName ?? null,
      districtCode: data.districtCode ?? null,
      districtName: data.districtName ?? null,
      subdistrictCode: data.subdistrictCode ?? null,
      subdistrictName: data.subdistrictName ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      notes: data.notes ?? null,
    };

    onSubmit(payload);

    if (mode === 'create') {
      createAddress(payload, {
        onSuccess: () => {
          reset();
          onClose();
          alertDialog.success({
            title: 'Alamat berhasil ditambahkan',
            description: 'Alamat baru telah ditambahkan ke daftar alamat Anda.',
          });
        },
      });
    } else if (mode === 'edit') {
      updateAddress(
        { id: addressId, data: payload },
        {
          onSuccess: () => {
            reset();
            onClose();
            alertDialog.success({
              title: 'Alamat berhasil diperbarui',
              description: 'Alamat baru telah diperbarui ke daftar alamat Anda.',
            });
          },
        },
      );
    }
  }

  useEffect(() => {
    if (mode === 'create') reset();
  }, [mode, reset]);

  useEffect(() => {
    if (!addressDetail || mode !== 'edit') return;

    setValues({
      label: addressDetail.label ?? '',
      recipientName: addressDetail.recipientName ?? '',
      recipientPhone: addressDetail.recipientPhone ?? '',
      provinceCode: addressDetail.provinceCode ?? '',
      provinceName: addressDetail.provinceName ?? '',
      cityCode: addressDetail.cityCode ?? '',
      cityName: addressDetail.cityName ?? '',
      districtCode: addressDetail.districtCode ?? '',
      districtName: addressDetail.districtName ?? '',
      subdistrictCode: addressDetail.subdistrictCode ?? '',
      subdistrictName: addressDetail.subdistrictName ?? '',
      postalCode: addressDetail.postalCode ?? '',
      addressLine: addressDetail.addressLine ?? '',
      latitude: addressDetail.latitude ?? null,
      longitude: addressDetail.longitude ?? null,
      notes: addressDetail.notes ?? '',
      isDefault: addressDetail.isDefault,
    });
  }, [mode, addressDetail, setValues]);

  return (
    <Modal open={open} onClose={onClose} title={TITLE_TEXT} description={DESC_TEXT} maxWidth='sm:max-w-[700px]'>
      <form onSubmit={handleAddressSubmit(onAddressSubmit)} className='space-y-4'>
        <Controller
          name='label'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.label')}</FieldLabel>
              <Input {...field} placeholder='Contoh: Rumah / Kantor' aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='recipientName'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.recipient')}</FieldLabel>
              <Input {...field} placeholder='Nama penerima' aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='recipientPhone'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.phone')}</FieldLabel>
              <Input
                {...field}
                placeholder='08xxxxxxxxxx'
                onChange={(e) => {
                  field.onChange(onlyNumbers(e.target.value));
                }}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='postalCode'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.postalCode')}</FieldLabel>
              <Input
                {...field}
                placeholder='17530'
                onChange={(e) => {
                  field.onChange(onlyNumbers(e.target.value));
                }}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='provinceName'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.province')}</FieldLabel>
              <Input {...field} placeholder='Jawa Barat' aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='cityName'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.city')}</FieldLabel>
              <Input {...field} placeholder='Kabupaten Bekasi' aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='districtName'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.district')}</FieldLabel>
              <Input {...field} placeholder='Cikarang Selatan' aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='subdistrictName'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.subdistrict')}</FieldLabel>
              <Input {...field} placeholder='Taman Sari' aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='addressLine'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.addressLine')}</FieldLabel>
              <Textarea {...field} placeholder='Jl. Melati 10 no. 68...' className='resize-none' aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='notes'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t('address.form.notes')}</FieldLabel>
              <Textarea {...field} placeholder='Catatan untuk kurir (opsional)' className='resize-none' aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='isDefault'
          control={addressControl}
          render={({ field, fieldState }) => (
            <Field orientation='horizontal' data-invalid={fieldState.invalid} className='flex items-center gap-2 pt-2'>
              <Checkbox id='form-address-checkbox' checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
              <div>
                <FieldLabel htmlFor='form-address-checkbox' className='cursor-pointer font-normal text-slate-700'>
                  {t('address.form.isDefault')}
                </FieldLabel>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type='submit' className='w-full rounded-xl mt-2 py-5' loading={isLoadingAddress} disabled={isLoadingAddress}>
          <Save className='size-4' />
          {SUBMIT_TEXT}
        </Button>
      </form>
    </Modal>
  );
}

const EMPTY_ADDRESS_FORM: AddressFormSchema = {
  label: '',
  recipientName: '',
  recipientPhone: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  subdistrictCode: '',
  subdistrictName: '',
  postalCode: '',
  addressLine: '',
  latitude: null,
  longitude: null,
  notes: '',
  isDefault: false,
};
