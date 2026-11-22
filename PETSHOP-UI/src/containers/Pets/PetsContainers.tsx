'use client';

import ApiErrorState from '@/components/Feedback/ApiErrorState';
import EmptyPets from '@/components/Empty/PetsEmpty';
import PetCardSkeleton from '@/components/Loading/PetCardSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeletePet, usePets } from '@/hooks/use-customer';
import { alertDialog } from '@/lib/alert-dialog';
import { usePetsStore } from '@/store/pets-store';
import type { Pet } from '@/types/address-types';
import { differenceInMonths } from 'date-fns/differenceInMonths';
import { differenceInYears } from 'date-fns/differenceInYears';
import {
  Mars,
  MoreVertical,
  PawPrintIcon,
  PencilIcon,
  Plus,
  Trash2,
  Venus,
  Weight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import PetsModalForm from './Form/PetsModalForm';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const SKELETON_COUNT = 3;

// -----------------------------------------------------------------------------
// Main Container
// -----------------------------------------------------------------------------

export default function PetsContainer() {
  const t = useTranslations();

  const {
    data: pets = [],
    isLoading: isPetsLoading,
    isError,
    refetch,
    isRefetching,
  } = usePets();

  const { isOpen, closeModal, openModal } = usePetsStore(
    (state) => state,
  );

  const handleAddPet = () => {
    openModal({ mode: 'create', id: null });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PawPrintIcon className="size-5" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-0.5">
            <h2 className="text-h3 text-foreground">
              {t('pet.title')}
            </h2>
            <p className="text-small text-muted-foreground">
              {t('pet.description')}
            </p>
          </div>
        </div>

        <Button onClick={handleAddPet} className="w-full sm:w-auto">
          <Plus data-icon="inline-start" aria-hidden="true" />
          {t('pet.register')}
        </Button>
      </div>

      {isError ? (
        <ApiErrorState
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      ) : (
        <PetsList
          pets={pets}
          isLoading={isPetsLoading}
          onAdd={handleAddPet}
        />
      )}

      <PetsModalForm open={isOpen} onClose={closeModal} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Pets List
// -----------------------------------------------------------------------------

type PetsListProps = {
  pets: Pet[];
  isLoading: boolean;
  onAdd: () => void;
};

function PetsList({ pets, isLoading, onAdd }: PetsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <PetCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (pets.length === 0) {
    return <EmptyPets onAdd={onAdd} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Pet Card
// -----------------------------------------------------------------------------

type PetCardProps = {
  pet: Pet;
};

function PetCard({ pet }: PetCardProps) {
  const t = useTranslations();

  const { mutate: deletePet } = useDeletePet();
  const { openModal } = usePetsStore((state) => state);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleDelete = (id: string, name: string) => {
    alertDialog.confirm({
      title: t('pet.deletePet'),
      description: t('pet.deleteConfirm', { name }),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      onConfirm: () => {
        deletePet(id, {
          onSuccess: () => {
            alertDialog.success({
              title: t('pet.deletedTitle'),
              description: t('pet.deletedDescription', { name }),
            });
          },
        });
      },
    });
  };

  const handleEdit = (id: string) => {
    openModal({
      mode: 'edit',
      id,
    });
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return '-';

    const birth = new Date(birthDate);
    const now = new Date();

    const years = differenceInYears(now, birth);
    const months = differenceInMonths(now, birth) % 12;

    if (years === 0) {
      return t('pet.age.months', { months });
    }

    if (months === 0) {
      return t('pet.age.years', { years });
    }

    return t('pet.age.yearsAndMonths', { years, months });
  };

  return (
    <Card className="h-full">
      <CardHeader className="relative pb-0">
        <div
          className="flex h-36 w-full items-center justify-center rounded-md bg-primary/5 text-primary sm:h-40"
          aria-hidden="true"
        >
          <PawPrintIcon className="size-12" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="secondary"
                size="icon"
                aria-label={t('common.actions')}
                className="absolute right-6 top-2 size-9 rounded-full"
              >
                <MoreVertical aria-hidden="true" />
              </Button>
            }
          />

          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => handleEdit(pet.id)}
                variant="default"
              >
                <PencilIcon data-icon="inline-start" />
                {t('common.edit')}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleDelete(pet.id, pet.name)}
                variant="destructive"
              >
                <Trash2 data-icon="inline-start" />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="min-w-0 wrap-break-word text-lg">
              {pet.name}
            </CardTitle>

            {pet.gender === 'MALE' && (
              <Mars
                className="size-4 shrink-0 text-primary"
                aria-label={t('pet.form.male')}
              />
            )}

            {pet.gender === 'FEMALE' && (
              <Venus
                className="size-4 shrink-0 text-primary"
                aria-label={t('pet.form.female')}
              />
            )}
          </div>

          <CardDescription>
            {[pet.breedName, pet.petTypeName]
              .filter(Boolean)
              .join(' · ') || t('pet.form.breedUnknown')}
          </CardDescription>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-md bg-muted/50 p-3">
          <div className="flex flex-col gap-1">
            <span className="text-small text-muted-foreground">
              {t('pet.ageLabel')}
            </span>

            <span className="text-sm font-medium">
              {calculateAge(pet.birthDate)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-small text-muted-foreground">
              {t('pet.form.weight')}
            </span>

            <span className="flex items-center gap-1 text-sm font-medium">
              <Weight
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              {t('pet.weightDisplay', { weight: pet.weightKg })}
            </span>
          </div>
        </div>

        {pet.microchipNumber && (
          <Badge variant="outline" className="w-fit font-normal">
            {t('pet.microchipDisplay', {
              number: pet.microchipNumber,
            })}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
