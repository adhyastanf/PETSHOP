'use client';

import type React from 'react';
import { FormEvent, useMemo, useState } from 'react';
import { CalendarDays, Edit3, Plus, Save, ShieldCheck, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/lib/api-client';
import {
  useBreeds,
  useCreatePet,
  useDeletePet,
  usePetTypes,
  usePets,
  useUpdatePet,
  useVaccinations,
} from './query';
import type { Pet, PetRequest } from './types';

const emptyPet: PetRequest = {
  name: '',
  petTypeId: '',
  breedId: null,
  gender: 'MALE',
  birthDate: null,
  birthDateEstimated: false,
  weightKg: null,
  color: '',
  sterilized: false,
  microchipNumber: '',
  profileImageFileId: null,
  allergies: '',
  specialNotes: '',
};

function petState(pet?: Pet): PetRequest {
  if (!pet) return emptyPet;
  return {
    name: pet.name,
    petTypeId: pet.petTypeId,
    breedId: pet.breedId,
    gender: pet.gender ?? 'MALE',
    birthDate: pet.birthDate,
    birthDateEstimated: pet.birthDateEstimated,
    weightKg: pet.weightKg,
    color: pet.color ?? '',
    sterilized: Boolean(pet.sterilized),
    microchipNumber: pet.microchipNumber ?? '',
    profileImageFileId: pet.profileImageFileId,
    allergies: pet.allergies ?? '',
    specialNotes: pet.specialNotes ?? '',
  };
}

function loadErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return 'Your session has expired. Please log in again.';
    }
    if (error.status === 403) {
      return 'This page is available only for customer or super admin accounts.';
    }
    return error.message;
  }

  if (error instanceof TypeError) {
    return 'Cannot reach the API server. Make sure the backend is running on http://localhost:8080.';
  }

  return 'Could not load pet data. Refresh or try again later.';
}

export default function PetManager() {
  const petTypesQuery = usePetTypes();
  const petsQuery = usePets();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();
  const [petForm, setPetForm] = useState<PetRequest>(emptyPet);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const activePetTypeId = petForm.petTypeId || petTypesQuery.data?.[0]?.id || '';
  const activeSelectedPetId = selectedPetId || petsQuery.data?.[0]?.id || null;
  const breedsQuery = useBreeds(activePetTypeId);
  const vaccinationsQuery = useVaccinations(activeSelectedPetId);

  const selectedPet = useMemo(
    () => petsQuery.data?.find((pet) => pet.id === activeSelectedPetId) ?? null,
    [petsQuery.data, activeSelectedPetId],
  );

  function submitPet(event: FormEvent) {
    event.preventDefault();
    const body = {
      ...petForm,
      petTypeId: activePetTypeId,
      breedId: petForm.breedId || null,
      birthDate: petForm.birthDate || null,
      weightKg: petForm.weightKg || null,
      profileImageFileId: petForm.profileImageFileId || null,
    };
    if (editingPetId) {
      updatePet.mutate({ id: editingPetId, data: body }, { onSuccess: resetPetForm });
    } else {
      createPet.mutate(body, { onSuccess: resetPetForm });
    }
  }

  function resetPetForm() {
    setEditingPetId(null);
    setPetForm({ ...emptyPet, petTypeId: petTypesQuery.data?.[0]?.id ?? '' });
  }

  if (petTypesQuery.isLoading || petsQuery.isLoading) {
    return <div className="py-10 text-sm text-muted-foreground">Loading pets...</div>;
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pets</h1>
          <p className="text-sm text-muted-foreground">Pet profiles and vaccination history</p>
        </div>
        <Link href="/customer/account">
          <Button type="button" variant="outline">Account</Button>
        </Link>
      </div>

      {(petTypesQuery.isError || petsQuery.isError) && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {loadErrorMessage(petTypesQuery.error ?? petsQuery.error)}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          {petsQuery.data?.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              No pets registered yet.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {petsQuery.data?.map((pet) => (
                <div key={pet.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-medium">{pet.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {pet.petTypeName}{pet.breedName ? ` · ${pet.breedName}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        title="Edit pet"
                        onClick={() => {
                          setEditingPetId(pet.id);
                          setPetForm(petState(pet));
                        }}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        title="Delete pet"
                        onClick={() => deletePet.mutate(pet.id)}
                        loading={deletePet.isPending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Info label="Gender" value={pet.gender || '-'} />
                    <Info label="Weight" value={pet.weightKg ? `${pet.weightKg} kg` : '-'} />
                    <Info label="Birth date" value={pet.birthDate || '-'} />
                    <Info label="Microchip" value={pet.microchipNumber || '-'} />
                  </dl>
                  <Button
                    type="button"
                    variant={activeSelectedPetId === pet.id ? 'default' : 'outline'}
                    className="mt-4"
                    onClick={() => setSelectedPetId(pet.id)}
                  >
                    <CalendarDays className="size-4" />
                    Vaccinations
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-md border p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <h2 className="font-medium">
                {selectedPet ? `${selectedPet.name} Vaccinations` : 'Vaccination History'}
              </h2>
            </div>
            {!activeSelectedPetId ? (
              <p className="mt-3 text-sm text-muted-foreground">Select a pet to view vaccination history.</p>
            ) : vaccinationsQuery.isLoading ? (
              <p className="mt-3 text-sm text-muted-foreground">Loading vaccination history...</p>
            ) : vaccinationsQuery.data?.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No vaccination records yet.</p>
            ) : (
              <div className="mt-3 divide-y">
                {vaccinationsQuery.data?.map((vaccination) => (
                  <div key={vaccination.id} className="py-3 text-sm">
                    <div className="font-medium">{vaccination.vaccineNameSnapshot}</div>
                    <div className="text-muted-foreground">
                      Given {vaccination.vaccinationDate}
                      {vaccination.nextVaccinationDate ? ` · Next ${vaccination.nextVaccinationDate}` : ''}
                    </div>
                    {vaccination.batchNumber && (
                      <div className="text-xs text-muted-foreground">Batch {vaccination.batchNumber}</div>
                    )}
                    {vaccination.notes && <div className="mt-1 text-xs">{vaccination.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={submitPet} className="space-y-4 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="size-4" />
              <h2 className="text-base font-medium">{editingPetId ? 'Edit Pet' : 'Register Pet'}</h2>
            </div>
            {editingPetId && (
              <Button type="button" variant="ghost" size="icon" title="Cancel edit" onClick={resetPetForm}>
                <X className="size-4" />
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <Input required value={petForm.name} onChange={(event) => setPetForm({ ...petForm, name: event.target.value })} />
            </Field>
            <Field label="Pet type">
              <select
                className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                required
                value={activePetTypeId}
                onChange={(event) => setPetForm({ ...petForm, petTypeId: event.target.value, breedId: null })}
              >
                {petTypesQuery.data?.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Breed">
              <select
                className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                value={petForm.breedId ?? ''}
                onChange={(event) => setPetForm({ ...petForm, breedId: event.target.value || null })}
              >
                <option value="">Unknown</option>
                {breedsQuery.data?.map((breed) => (
                  <option key={breed.id} value={breed.id}>{breed.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Gender">
              <select
                className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                value={petForm.gender}
                onChange={(event) => setPetForm({ ...petForm, gender: event.target.value })}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </Field>
            <Field label="Birth date">
              <Input type="date" value={petForm.birthDate ?? ''} onChange={(event) => setPetForm({ ...petForm, birthDate: event.target.value || null })} />
            </Field>
            <Field label="Weight kg">
              <Input type="number" min="0" step="0.01" value={petForm.weightKg ?? ''} onChange={(event) => setPetForm({ ...petForm, weightKg: event.target.value || null })} />
            </Field>
            <Field label="Color">
              <Input value={petForm.color} onChange={(event) => setPetForm({ ...petForm, color: event.target.value })} />
            </Field>
            <Field label="Microchip">
              <Input value={petForm.microchipNumber} onChange={(event) => setPetForm({ ...petForm, microchipNumber: event.target.value })} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={petForm.birthDateEstimated}
              onChange={(event) => setPetForm({ ...petForm, birthDateEstimated: event.target.checked })}
            />
            Birth date is estimated
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={petForm.sterilized}
              onChange={(event) => setPetForm({ ...petForm, sterilized: event.target.checked })}
            />
            Sterilized
          </label>
          <Field label="Allergies">
            <Textarea value={petForm.allergies} onChange={(event) => setPetForm({ ...petForm, allergies: event.target.value })} />
          </Field>
          <Field label="Special notes">
            <Textarea value={petForm.specialNotes} onChange={(event) => setPetForm({ ...petForm, specialNotes: event.target.value })} />
          </Field>
          <Button type="submit" loading={createPet.isPending || updatePet.isPending}>
            <Save className="size-4" />
            {editingPetId ? 'Update Pet' : 'Register Pet'}
          </Button>
        </form>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate">{value}</dd>
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
