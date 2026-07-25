'use client';

import type React from 'react';
import { FormEvent, useState } from 'react';
import { Edit3, Home, Plus, Save, Star, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    return <div className="py-10 text-sm text-muted-foreground">Loading account details...</div>;
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Account</h1>
          <p className="text-sm text-muted-foreground">Profile and delivery addresses</p>
        </div>
        <Link href="/customer/pets">
          <Button type="button" variant="outline">
            Pets
          </Button>
        </Link>
      </div>

      {(profileQuery.isError || addressesQuery.isError) && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Could not load customer data. Refresh or try again later.
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
            <h2 className="text-base font-medium">Addresses</h2>
          </div>
          {addressesQuery.data?.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              No addresses yet.
            </div>
          ) : (
            <div className="space-y-3">
              {addressesQuery.data?.map((address) => (
                <div key={address.id} className="rounded-md border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{address.label || 'Address'}</h3>
                        {address.isDefault && (
                          <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            Default
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
                          title="Set default"
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
                        title="Edit address"
                        onClick={() => {
                          setEditingAddressId(address.id);
                          setAddressForm(addressState(address));
                        }}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        title="Delete address"
                        onClick={() => deleteAddress.mutate(address.id)}
                        disabled={pending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
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
              <h2 className="text-base font-medium">{editingAddressId ? 'Edit Address' : 'New Address'}</h2>
            </div>
            {editingAddressId && (
              <Button type="button" variant="ghost" size="icon" title="Cancel edit" onClick={resetAddressForm}>
                <X className="size-4" />
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Label"><Input value={addressForm.label ?? ''} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })} /></Field>
            <Field label="Recipient"><Input required value={addressForm.recipientName} onChange={(event) => setAddressForm({ ...addressForm, recipientName: event.target.value })} /></Field>
            <Field label="Phone"><Input required value={addressForm.recipientPhone} onChange={(event) => setAddressForm({ ...addressForm, recipientPhone: event.target.value })} /></Field>
            <Field label="Postal code"><Input required value={addressForm.postalCode} onChange={(event) => setAddressForm({ ...addressForm, postalCode: event.target.value })} /></Field>
            <Field label="Province"><Input value={addressForm.provinceName ?? ''} onChange={(event) => setAddressForm({ ...addressForm, provinceName: event.target.value })} /></Field>
            <Field label="City"><Input value={addressForm.cityName ?? ''} onChange={(event) => setAddressForm({ ...addressForm, cityName: event.target.value })} /></Field>
            <Field label="District"><Input value={addressForm.districtName ?? ''} onChange={(event) => setAddressForm({ ...addressForm, districtName: event.target.value })} /></Field>
            <Field label="Subdistrict"><Input value={addressForm.subdistrictName ?? ''} onChange={(event) => setAddressForm({ ...addressForm, subdistrictName: event.target.value })} /></Field>
          </div>
          <Field label="Address line">
            <Textarea required value={addressForm.addressLine} onChange={(event) => setAddressForm({ ...addressForm, addressLine: event.target.value })} />
          </Field>
          <Field label="Notes">
            <Textarea value={addressForm.notes ?? ''} onChange={(event) => setAddressForm({ ...addressForm, notes: event.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })}
            />
            Set as default
          </label>
          <Button type="submit" loading={createAddress.isPending || updateAddress.isPending}>
            <Save className="size-4" />
            {editingAddressId ? 'Update Address' : 'Add Address'}
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
        <h2 className="text-base font-medium">Profile</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name">
          <Input
            value={profileForm.fullName}
            onChange={(event) => setProfileForm({ ...profileForm, fullName: event.target.value })}
            required
          />
        </Field>
        <Field label="Phone">
          <Input
            value={profileForm.phoneNumber}
            onChange={(event) => setProfileForm({ ...profileForm, phoneNumber: event.target.value })}
          />
        </Field>
        <Field label="Gender">
          <select
            className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
            value={profileForm.gender}
            onChange={(event) => setProfileForm({ ...profileForm, gender: event.target.value })}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </Field>
        <Field label="Birth date">
          <Input
            type="date"
            value={profileForm.birthDate}
            onChange={(event) => setProfileForm({ ...profileForm, birthDate: event.target.value })}
          />
        </Field>
      </div>
      <Button type="submit" loading={pending}>
        <Save className="size-4" />
        Save Profile
      </Button>
    </form>
  );
}
