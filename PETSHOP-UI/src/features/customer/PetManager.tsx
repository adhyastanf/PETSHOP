'use client';

import type React from 'react';
import { FormEvent, useMemo, useState } from 'react';
import { CalendarDays, Edit3, Plus, Save, ShieldCheck, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/lib/api-client';
import { useI18n } from '@/lib/i18n';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
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

export default function PetManager() {
  const { t } = useI18n();
  const petTypesQuery = usePetTypes();
  const petsQuery = usePets();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();
  const [petForm, setPetForm] = useState<PetRequest>(emptyPet);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [hasMicrochip, setHasMicrochip] = useState(false);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [hasSpecialNotes, setHasSpecialNotes] = useState(false);
  const activePetTypeId = petForm.petTypeId || petTypesQuery.data?.[0]?.id || '';
  const activeSelectedPetId = selectedPetId || petsQuery.data?.[0]?.id || null;
  const breedsQuery = useBreeds(activePetTypeId);
  const vaccinationsQuery = useVaccinations(activeSelectedPetId);

  const selectedPet = useMemo(
    () => petsQuery.data?.find((pet) => pet.id === activeSelectedPetId) ?? null,
    [petsQuery.data, activeSelectedPetId],
  );

  function loadErrorMessage(error: unknown) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return t('error.sessionExpired');
      }
      if (error.status === 403) {
        return t('error.noPermission');
      }
      return error.message;
    }

    if (error instanceof TypeError) {
      return t('error.apiUnavailable');
    }

    return t('common.unknownError');
  }

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
      updatePet.mutate({ id: editingPetId, data: body }, {
        onSuccess: resetPetForm,
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(error.message || t('pet.failedUpdate'));
          } else {
            toast.error(t('common.networkError'));
          }
        },
      });
    } else {
      createPet.mutate(body, {
        onSuccess: resetPetForm,
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(error.message || t('pet.failedCreate'));
          } else {
            toast.error(t('common.networkError'));
          }
        },
      });
    }
  }

  function resetPetForm() {
    setEditingPetId(null);
    setPetForm({ ...emptyPet, petTypeId: petTypesQuery.data?.[0]?.id ?? '' });
    setHasMicrochip(false);
    setHasAllergies(false);
    setHasSpecialNotes(false);
  }

  if (petTypesQuery.isLoading || petsQuery.isLoading) {
    return <div className="py-10 text-sm text-muted-foreground">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('pet.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('pet.description')}</p>
        </div>
        <Link href="/customer/account">
          <Button type="button" variant="outline">{t('customer.nav.myProfile')}</Button>
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
              {t('pet.noPets')}
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
                        title={t('pet.editPet')}
                        onClick={() => {
                          setEditingPetId(pet.id);
                          setPetForm(petState(pet));
                          setHasMicrochip(Boolean(pet.microchipNumber));
                          setHasAllergies(Boolean(pet.allergies));
                          setHasSpecialNotes(Boolean(pet.specialNotes));
                        }}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <ConfirmDialog
                        title={t('pet.deletePet')}
                        description={t('pet.deleteConfirm', { name: pet.name })}
                        onConfirm={() => deletePet.mutate(pet.id, {
                          onError: (error) => {
                            if (error instanceof ApiError) {
                              toast.error(error.message || t('pet.failedDelete'));
                            } else {
                              toast.error(t('common.networkError'));
                            }
                          },
                        })}
                        loading={deletePet.isPending}
                      >
                        {(open) => (
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            title={t('pet.deletePet')}
                            onClick={open}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </ConfirmDialog>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Info label={t('pet.form.gender')} value={pet.gender || '-'} />
                    <Info label={t('pet.form.weight')} value={pet.weightKg ? `${pet.weightKg} kg` : '-'} />
                    <Info label={t('pet.form.birthDate')} value={pet.birthDate || '-'} />
                    <Info label={t('pet.form.microchipNumber')} value={pet.microchipNumber || '-'} />
                  </dl>
                  <Button
                    type="button"
                    variant={activeSelectedPetId === pet.id ? 'default' : 'outline'}
                    className="mt-4"
                    onClick={() => setSelectedPetId(pet.id)}
                  >
                    <CalendarDays className="size-4" />
                    {t('pet.vaccination.title')}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-md border p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <h2 className="font-medium">
                {selectedPet ? `${selectedPet.name} ${t('pet.vaccination.title')}` : t('pet.vaccination.title')}
              </h2>
            </div>
            {!activeSelectedPetId ? (
              <p className="mt-3 text-sm text-muted-foreground">{t('pet.vaccination.selectPet')}</p>
            ) : vaccinationsQuery.isLoading ? (
              <p className="mt-3 text-sm text-muted-foreground">{t('pet.vaccination.loading')}</p>
            ) : vaccinationsQuery.data?.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">{t('pet.vaccination.noRecords')}</p>
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
              <h2 className="text-base font-medium">{editingPetId ? t('pet.editPet') : t('pet.register')}</h2>
            </div>
            {editingPetId && (
              <Button type="button" variant="ghost" size="icon" title={t('common.cancel')} onClick={resetPetForm}>
                <X className="size-4" />
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t('pet.form.name')}>
              <Input required value={petForm.name} onChange={(event) => setPetForm({ ...petForm, name: event.target.value })} />
            </Field>
            <Field label={t('pet.form.petType')}>
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
            <Field label={t('pet.form.breed')}>
              <select
                className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                value={petForm.breedId ?? ''}
                onChange={(event) => setPetForm({ ...petForm, breedId: event.target.value || null })}
              >
                <option value="">{t('pet.form.breedUnknown')}</option>
                {breedsQuery.data?.map((breed) => (
                  <option key={breed.id} value={breed.id}>{breed.name}</option>
                ))}
              </select>
            </Field>
            <Field label={t('pet.form.gender')}>
              <select
                className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                value={petForm.gender}
                onChange={(event) => setPetForm({ ...petForm, gender: event.target.value })}
              >
                <option value="MALE">{t('pet.form.male')}</option>
                <option value="FEMALE">{t('pet.form.female')}</option>
              </select>
            </Field>
            <Field label={t('pet.form.birthDate')}>
              <Input type="date" value={petForm.birthDate ?? ''} onChange={(event) => setPetForm({ ...petForm, birthDate: event.target.value || null })} />
            </Field>
            <Field label={t('pet.form.weight')}>
              <Input type="number" min="0" step="0.01" value={petForm.weightKg ?? ''} onChange={(event) => setPetForm({ ...petForm, weightKg: event.target.value || null })} />
            </Field>
            <Field label={t('pet.form.color')}>
              <Input value={petForm.color} onChange={(event) => setPetForm({ ...petForm, color: event.target.value })} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={petForm.birthDateEstimated}
              onChange={(event) => setPetForm({ ...petForm, birthDateEstimated: event.target.checked })}
            />
            {t('pet.form.birthDateEstimated')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={petForm.sterilized}
              onChange={(event) => setPetForm({ ...petForm, sterilized: event.target.checked })}
            />
            {t('pet.form.sterilized')}
          </label>

          {/* Optional fields — only show input when checked */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasMicrochip}
                onChange={(event) => {
                  setHasMicrochip(event.target.checked);
                  if (!event.target.checked) setPetForm({ ...petForm, microchipNumber: '' });
                }}
              />
              {t('pet.form.hasMicrochip')}
            </label>
            {hasMicrochip && (
              <Field label={t('pet.form.microchipNumber')}>
                <Input value={petForm.microchipNumber} onChange={(event) => setPetForm({ ...petForm, microchipNumber: event.target.value })} />
              </Field>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasAllergies}
                onChange={(event) => {
                  setHasAllergies(event.target.checked);
                  if (!event.target.checked) setPetForm({ ...petForm, allergies: '' });
                }}
              />
              {t('pet.form.hasAllergies')}
            </label>
            {hasAllergies && (
              <Field label={t('pet.form.allergies')}>
                <Textarea value={petForm.allergies} onChange={(event) => setPetForm({ ...petForm, allergies: event.target.value })} />
              </Field>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasSpecialNotes}
                onChange={(event) => {
                  setHasSpecialNotes(event.target.checked);
                  if (!event.target.checked) setPetForm({ ...petForm, specialNotes: '' });
                }}
              />
              {t('pet.form.hasSpecialNotes')}
            </label>
            {hasSpecialNotes && (
              <Field label={t('pet.form.specialNotes')}>
                <Textarea value={petForm.specialNotes} onChange={(event) => setPetForm({ ...petForm, specialNotes: event.target.value })} />
              </Field>
            )}
          </div>
          <Button type="submit" loading={createPet.isPending || updatePet.isPending}>
            <Save className="size-4" />
            {editingPetId ? t('pet.editPet') : t('pet.register')}
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
