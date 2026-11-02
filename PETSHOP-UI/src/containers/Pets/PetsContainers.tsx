'use client';

import PetCardSkeleton from '@/components/Loading/PetCardSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeletePet, usePets } from '@/hooks/use-customer';
import { alertDialog } from '@/lib/alert-dialog';
import { usePetsStore } from '@/store/pets-store';
import { Pet } from '@/types/address-types';
import { differenceInMonths } from 'date-fns/differenceInMonths';
import { differenceInYears } from 'date-fns/differenceInYears';
import { Mars, MoreVertical, PawPrintIcon, Pencil, Plus, Trash2, Venus } from 'lucide-react';
import Image from 'next/image';
import PetsModalForm from './Form/PetsModalForm';

export default function PetsContainer() {
  const { data: pets = [], isLoading: isPetsLoading } = usePets();
  const { isOpen, closeModal } = usePetsStore((state) => state);

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <div className='p-3 bg-blue-50 text-blue-600 rounded'>
          <PawPrintIcon className='size-5' />
        </div>
        <div className='space-x-4'>
          <h2 className='text-xl font-semibold text-gray-900'>My Pets</h2>
          <p className='text-xs text-gray-500'>Kelola informasi hewan peliharaan Anda</p>
        </div>
      </div>

      <ScrollArea className='h-120'>
        <div className='p-1'>
          <PetsList pets={pets} isLoading={isPetsLoading} />
        </div>
      </ScrollArea>
      <PetsModalForm open={isOpen} onClose={closeModal} />
    </div>
  );
}

function PetsList({ pets, isLoading }: { pets: Pet[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, index) => (
          <PetCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
      <PetCardAdd />
    </div>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  const { openModal } = usePetsStore((state) => state);
  const { mutate: deletePet } = useDeletePet();

  function handleEdit(id: string) {
    openModal({
      mode: 'edit',
      id,
    });
  }

  function handleDelete(id: string, name: string) {
    alertDialog.confirm({
      title: 'Hapus Hewan',
      description: `Apakah anda yakin ingin menghapus hewan ${name}?`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        deletePet(id, {
          onSuccess: () => {
            alertDialog.success({
              title: 'Hapus Hewan',
              description: `Hewan ${name} berhasil dihapus`,
            });
          },
        });
      },
    });
  }

  function calculateAge(birthDate: string | null) {
    if (!birthDate) return '-';

    const birth = new Date(birthDate);
    const now = new Date();

    const years = differenceInYears(now, birth);
    const months = differenceInMonths(now, birth) % 12;

    if (years === 0) {
      return `${months} bulan`;
    }

    if (months === 0) {
      return `${years} tahun`;
    }

    return `${years} tahun ${months} bulan`;
  }

  return (
    <Card className='relative flex h-auto w-full flex-col border-0'>
      <CardHeader className='relative'>
        <div className='relative h-36 w-full overflow-hidden rounded-xl sm:h-40'>
          <Image src='https://picsum.photos/1000/800?grayscale&random=62' alt={pet?.name || 'Default Pet Image'} fill sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw' className='object-cover' />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant='secondary' size='icon' className='absolute right-6 top-2 size-8 rounded-full'>
                <MoreVertical className='size-4' />
              </Button>
            }
          />

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleEdit(pet.id)}>
              <Pencil className='mr-2 size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(pet.id, pet.name)} className='text-destructive focus:text-destructive'>
              <Trash2 className='mr-2 size-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='flex flex-col items-start space-y-1.5'>
        <div className='flex items-center gap-1'>
          <h2 className='min-w-0 wrap-break-word text-base font-bold sm:text-lg'>{pet.name.toUpperCase()}</h2>
          {pet.gender === 'MALE' && <Mars className='size-5 text-blue-500' />}
          {pet.gender === 'FEMALE' && <Venus className='size-5 text-pink-500' />}
        </div>
        <h2>{pet.breedName || '-'}</h2>
        <div className='flex flex-wrap items-center gap-1'>
          <Badge variant='secondary' className='font-bold'>
            {pet.petTypeName || '-'}
          </Badge>
          <Badge variant='secondary' className='font-bold'>
            {calculateAge(pet.birthDate)}
          </Badge>
          <Badge variant='secondary' className='font-bold'>
            {pet.weightKg}Kg
          </Badge>
        </div>
        {pet.microchipNumber && (
          <Badge variant='secondary' className='font-bold'>
            Microchip #{pet.microchipNumber}
          </Badge>
        )}
        <Button variant='default' size='sm' className='mt-4 w-full'>
          Lihat Detail
        </Button>
      </CardContent>
    </Card>
  );
}

function PetCardAdd() {
  const { openModal } = usePetsStore((state) => state);

  function handleOpen() {
    openModal({
      mode: 'create',
      id: null,
    });
  }

  return (
    <Button
      variant='ghost'
      className='flex h-auto w-full flex-col items-center justify-center gap-2 self-stretch whitespace-normal rounded-xl border-2 border-dashed border-muted-foreground/30 p-3 text-center hover:bg-muted/50 sm:p-4'
      onClick={handleOpen}
    >
      <div className='flex flex-col items-center justify-center gap-3'>
        <div className='flex size-10 items-center justify-center rounded-full border bg-background'>
          <Plus className='size-5' />
        </div>
        <div className='text-center'>
          <p className='font-semibold'>Tambah Hewan</p>
          <p className='text-sm text-muted-foreground'>Tambahkan anabul baru</p>
        </div>
      </div>
    </Button>
  );
}
