'use client';

import type React from 'react';
import { FormEvent, useState } from 'react';
import { Edit3, Home, Plus, Save, Star, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/lib/i18n';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import {
  useAddresses,
  useCreateAddress,
  useCustomerProfile,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
  useUpdateCustomerProfile,
} from './query';
import type { Address, AddressRequest, CustomerProfile, UpdateCustomerProfileRequest } from './types';

const emptyAddress: AddressRequest = {
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

function profileState(profile?: CustomerProfile) {
  return {
    fullName: profile?.fullName ?? '',
    phoneNumber: profile?.phoneNumber ?? '',
    gender: profile?.gender ?? 'MALE',
    birthDate: profile?.birthDate ?? '',
  };
}

function addressState(address?: Address): AddressRequest {
  if (!address) return emptyAddress;
  return {
    label: address.label ?? '',
    recipientName: address.recipientName,
    recipientPhone: address.recipientPhone,
    provinceCode: address.provinceCode ?? '',
    provinceName: address.provinceName ?? '',
    cityCode: address.cityCode ?? '',
    cityName: address.cityName ?? '',
    districtCode: address.districtCode ?? '',
    districtName: address.districtName ?? '',
    subdistrictCode: address.subdistrictCode ?? '',
    subdistrictName: address.subdistrictName ?? '',
    postalCode: address.postalCode,
    addressLine: address.addressLine,
    latitude: address.latitude,
    longitude: address.longitude,
    notes: address.notes ?? '',
    isDefault: address.isDefault,
  };
}

export default function AccountManager() {
  const { t } = useI18n();
  const profileQuery = useCustomerProfile();
  const addressesQuery = useAddresses();
  const updateProfile = useUpdateCustomerProfile();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const deleteAddress = useDeleteAddress();
  const [addressForm, setAddressForm] = useState<AddressRequest>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const pending =
    updateProfile.isPending ||
    createAddress.isPending ||
    updateAddress.isPending ||
    setDefaultAddress.isPending ||
    deleteAddress.isPending;

  function submitAddress(event: FormEvent) {
    event.preventDefault();
    const body = {
      ...addressForm,
      latitude: addressForm.latitude || null,
      longitude: addressForm.longitude || null,
    };
    if (editingAddressId) {
      updateAddress.mutate({ id: editingAddressId, data: body }, { onSuccess: resetAddressForm });
    } else {
      createAddress.mutate(body, { onSuccess: resetAddressForm });
    }
  }

  function resetAddressForm() {
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
  }

  if (profileQuery.isLoading || addressesQuery.isLoading) {
    return <div className="py-10 text-sm text-muted-foreground">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('customer.profile.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('customer.profile.description')}</p>
        </div>
        <Link href="/customer/pets">
          <Button type="button" variant="outline">
            {t('pet.title')}
          </Button>
        </Link>
      </div>

      {(profileQuery.isError || addressesQuery.isError) && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {t('common.unknownError')}
        </div>
      )}

      <ProfileForm
        key={profileQuery.data?.userId ?? 'profile'}
        profile={profileQuery.data}
        pending={updateProfile.isPending}
        onSubmit={(data) => updateProfile.mutate(data)}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Home className="size-4" />
            <h2 className="text-base font-medium">{t('address.title')}</h2>
          </div>
          {addressesQuery.data?.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              {t('address.noAddresses')}
            </div>
          ) : (
            <div className="space-y-3">
              {addressesQuery.data?.map((address) => (
                <div key={address.id} className="rounded-md border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{address.label || t('address.title')}</h3>
                        {address.isDefault && (
                          <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            {t('address.default')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{address.recipientName} · {address.recipientPhone}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {address.addressLine}, {address.subdistrictName}, {address.districtName}, {address.cityName}, {address.provinceName} {address.postalCode}
                      </p>
                      {address.notes && <p className="mt-1 text-xs text-muted-foreground">{address.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title={t('address.setDefault')}
                          onClick={() => setDefaultAddress.mutate(address.id)}
                          disabled={pending}
                        >
                          <Star className="size-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title={t('address.editAddress')}
                        onClick={() => {
                          setEditingAddressId(address.id);
                          setAddressForm(addressState(address));
                        }}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <ConfirmDialog
                        title={t('address.deleteAddress')}
                        description={t('address.deleteConfirm', { label: address.label || 'this' })}
                        onConfirm={() => deleteAddress.mutate(address.id)}
                        loading={deleteAddress.isPending}
                      >
                        {(open) => (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            title={t('address.deleteAddress')}
                            onClick={open}
                            disabled={pending}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </ConfirmDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={submitAddress} className="space-y-4 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="size-4" />
              <h2 className="text-base font-medium">{editingAddressId ? t('address.editAddress') : t('address.newAddress')}</h2>
            </div>
            {editingAddressId && (
              <Button type="button" variant="ghost" size="icon" title={t('common.cancel')} onClick={resetAddressForm}>
                <X className="size-4" />
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t('address.form.label')}><Input value={addressForm.label ?? ''} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })} /></Field>
            <Field label={t('address.form.recipient')}><Input required value={addressForm.recipientName} onChange={(event) => setAddressForm({ ...addressForm, recipientName: event.target.value })} /></Field>
            <Field label={t('address.form.phone')}><Input required value={addressForm.recipientPhone} onChange={(event) => setAddressForm({ ...addressForm, recipientPhone: event.target.value })} /></Field>
            <Field label={t('address.form.postalCode')}><Input required value={addressForm.postalCode} onChange={(event) => setAddressForm({ ...addressForm, postalCode: event.target.value })} /></Field>
            <Field label={t('address.form.province')}><Input value={addressForm.provinceName ?? ''} onChange={(event) => setAddressForm({ ...addressForm, provinceName: event.target.value })} /></Field>
            <Field label={t('address.form.city')}><Input value={addressForm.cityName ?? ''} onChange={(event) => setAddressForm({ ...addressForm, cityName: event.target.value })} /></Field>
            <Field label={t('address.form.district')}><Input value={addressForm.districtName ?? ''} onChange={(event) => setAddressForm({ ...addressForm, districtName: event.target.value })} /></Field>
            <Field label={t('address.form.subdistrict')}><Input value={addressForm.subdistrictName ?? ''} onChange={(event) => setAddressForm({ ...addressForm, subdistrictName: event.target.value })} /></Field>
          </div>
          <Field label={t('address.form.addressLine')}>
            <Textarea required value={addressForm.addressLine} onChange={(event) => setAddressForm({ ...addressForm, addressLine: event.target.value })} />
          </Field>
          <Field label={t('address.form.notes')}>
            <Textarea value={addressForm.notes ?? ''} onChange={(event) => setAddressForm({ ...addressForm, notes: event.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })}
            />
            {t('address.form.isDefault')}
          </label>
          <Button type="submit" loading={createAddress.isPending || updateAddress.isPending}>
            <Save className="size-4" />
            {editingAddressId ? t('address.update') : t('address.submit')}
          </Button>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ProfileForm({
  profile,
  pending,
  onSubmit,
}: {
  profile?: CustomerProfile;
  pending: boolean;
  onSubmit: (data: UpdateCustomerProfileRequest) => void;
}) {
  const { t } = useI18n();
  const [profileForm, setProfileForm] = useState(profileState(profile));

  function submitProfile(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      fullName: profileForm.fullName,
      phoneNumber: profileForm.phoneNumber,
      gender: profileForm.gender,
      birthDate: profileForm.birthDate || null,
    });
  }

  return (
    <form onSubmit={submitProfile} className="space-y-4 rounded-md border p-4">
      <div className="flex items-center gap-2">
        <Edit3 className="size-4" />
        <h2 className="text-base font-medium">{t('customer.profile.title')}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('auth.register.fullName')}>
          <Input
            value={profileForm.fullName}
            onChange={(event) => setProfileForm({ ...profileForm, fullName: event.target.value })}
            required
          />
        </Field>
        <Field label={t('address.form.phone')}>
          <Input
            value={profileForm.phoneNumber}
            onChange={(event) => setProfileForm({ ...profileForm, phoneNumber: event.target.value })}
          />
        </Field>
        <Field label={t('pet.form.gender')}>
          <select
            className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
            value={profileForm.gender}
            onChange={(event) => setProfileForm({ ...profileForm, gender: event.target.value })}
          >
            <option value="MALE">{t('pet.form.male')}</option>
            <option value="FEMALE">{t('pet.form.female')}</option>
          </select>
        </Field>
        <Field label={t('pet.form.birthDate')}>
          <Input
            type="date"
            value={profileForm.birthDate}
            onChange={(event) => setProfileForm({ ...profileForm, birthDate: event.target.value })}
          />
        </Field>
      </div>
      <Button type="submit" loading={pending}>
        <Save className="size-4" />
        {t('common.save')}
      </Button>
    </form>
  );
}
