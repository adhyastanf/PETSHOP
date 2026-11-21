# Oyen — UI Development Guide

> **For human developers only.** This document is a reference guide for developers working on the project. AI agents should not read or use this file for implementation decisions — refer to `AGENTS.md` and the canonical UI docs instead.

Step-by-step guide for building a frontend feature end-to-end. The backend flow is in the API project (`PETSHOP-API/docs/DEVELOPMENT_GUIDE.md`).

---

## Frontend Flow (Next.js)

```
API Endpoint (Backend)
    ↓
Types — TypeScript interfaces matching DTOs
    ↓
Service — functions calling the axios `api` instance
    ↓
Hook — TanStack Query (useQuery/useMutation)
    ↓
Container/Page — UI consuming the hook
```

Frontend architecture details (auth proxy, i18n, containers, state) are in `PETSHOP-UI/docs/FRONTEND_ARCHITECTURE.md`.

---

### Step 1: Types

Location: `PETSHOP-UI/src/types/`

```typescript
// types/pet.ts
export interface CreatePetRequest {
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string; // ISO date string "2020-01-15"
}

export interface PetResponse {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  dateOfBirth: string | null;
}
```

Rules:
- Match the backend DTO structure exactly
- Use `string` for UUID and dates (JSON serialization)
- Use `| null` for nullable fields, `?` for optional request fields

---

### Step 2: Service

Location: `PETSHOP-UI/src/services/` (or `PETSHOP-UI/src/features/<name>/<name>-service.ts` for a self-contained feature module)

```typescript
// services/pet.service.ts
import api from '@/lib/api';
import type { CreatePetRequest, PetResponse } from '@/types/pet';

export const petService = {
  async getMyPets(): Promise<PetResponse[]> {
    return (await api.get<PetResponse[]>('/pets')).data;
  },

  async createPet(data: CreatePetRequest): Promise<PetResponse> {
    return (await api.post<PetResponse>('/pets', data)).data;
  },
};
```

Rules:
- Use the shared axios instance from `@/lib/api`. It calls the same-origin Next.js proxy (`/api/...`), which injects the httpOnly-cookie access token and refreshes it on 401. Never handle tokens in the browser.
- Endpoints are relative to the backend API base (`/pets`, not `/api/v1/pets`).
- Failures arrive as `ApiError` (`@/lib/api-error`) with a stable `code`.
- One service file per feature/domain
- Type the return values

---

### Step 3: Hook (TanStack Query)

Location: `PETSHOP-UI/src/hooks/`

```typescript
// hooks/use-pets.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '@/services/pet-service';
import type { CreatePetRequest } from '@/types/pet';

export function useMyPets() {
  return useQuery({
    queryKey: ['pets', 'mine'],
    queryFn: () => petService.getMyPets(),
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePetRequest) => petService.createPet(data),
    onSuccess: () => {
      // Refetch pet list after creating a new one
      queryClient.invalidateQueries({ queryKey: ['pets', 'mine'] });
    },
  });
}
```

Rules:
- `useQuery` for GET requests (reading data)
- `useMutation` for POST/PUT/DELETE (writing data)
- Invalidate related queries on success so UI stays fresh
- Use stable, descriptive query keys

---

### Step 4: Validation (optional but recommended)

Location: `PETSHOP-UI/src/lib/schema/`

```typescript
// lib/schema/pet-schema.ts
import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1).max(100),
  species: z.string().min(1).max(50),
  breed: z.string().max(100).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
});

export type CreatePetFormData = z.infer<typeof createPetSchema>;
```

Use the schema with React Hook Form (`zodResolver`). Show validation messages through translation keys, not hardcoded text.

---

### Step 5: Container + Page

Pages stay thin and render a container. Location:
- Container: `PETSHOP-UI/src/containers/Pets/PetsContainers.tsx` (modal forms in `containers/Pets/Form/`)
- Page: `PETSHOP-UI/src/app/[locale]/(customer)/user/settings/[tab]/page.tsx` (all routes live under `[locale]`)

```tsx
// containers/Pets/PetsContainers.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useMyPets, useCreatePet } from '@/hooks/use-pets';
import { Button } from '@/components/ui/button';

export default function PetsContainers() {
  const t = useTranslations();
  const { data: pets, isLoading, error } = useMyPets();
  const createMutation = useCreatePet();

  if (isLoading) return <p>{t('common.loading')}</p>;          // loading
  if (error) return <p>{t('pet.loadError')}</p>;               // error
  if (!pets?.length) return <p>{t('pet.empty')}</p>;           // empty

  return (
    <div>
      <h1>{t('customer.nav.myPets')}</h1>
      {pets.map((pet) => (
        <p key={pet.id}>{pet.name} — {pet.species}</p>
      ))}
      <Button onClick={() => createMutation.mutate({ name: 'Milo', species: 'Cat' })} loading={createMutation.isPending}>
        {t('pet.add')}
      </Button>
    </div>
  );
}
```

Translation keys in the example are illustrative; use or add real keys in `src/locales/`.

Rules:
- Always handle: loading, error, empty, and success states
- Every user-facing string goes through `useTranslations()`; add keys to both `en` and `id` under `src/locales/`
- Use the hook directly in the container/page; never call axios or fetch from a component. Go through hook → service
- Forms use React Hook Form + a Zod schema from `lib/schema/`
- Confirm destructive or submit actions with `alertDialog.confirm(...)` (`@/lib/alert-dialog`)
- Show API errors with a Sonner toast (`getErrorMessage` maps the error code to a translated message)
- Internal links and navigation use the helpers from `@/lib/i18n/navigation` so the locale prefix is kept
- Protected areas are guarded by `src/proxy.ts`; add a `routePermissions` entry for any new role-restricted path


---

## Frontend Feature Checklist

```
□ TypeScript types (matching DTOs)
□ Service file (calling the axios `api` instance)
□ Hook (useQuery / useMutation)
□ Zod schema in lib/schema (for forms)
□ Translation keys in both locales (en + id)
□ Container + thin page under app/[locale]/
□ Route rule in proxy.ts (if role-restricted)
□ Loading / error / empty states
□ Test for the hook/component behavior
```

---

## Layer Responsibilities

| Layer | Does | Never Does |
|---|---|---|
| Types | Define data shapes | API calls |
| Service | Call API via the axios `api` instance | UI rendering |
| Hook | Manage server state (cache, refetch) | Direct API calls |
| Container/Page | Render UI, handle user interaction | Business logic |

---

## Deployment (Vercel)


| Setting | Value |
|---------|-------|
| Root Directory | `PETSHOP-UI` |
| Framework | Next.js |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

Environment variables to set in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` — Koyeb backend URL + `/api/v1`
- `NEXT_PUBLIC_APP_NAME` — `Oyen`
- `NEXT_PUBLIC_DEFAULT_LOCALE` — `en`
- `NEXT_PUBLIC_SUPPORTED_LOCALES` — `en,id`
- `NEXT_PUBLIC_ENVIRONMENT` — `development`



Server-side variables required by the Next.js API proxy (also set them in CI for `npm run build`):
- `BACKEND_URL` — backend base URL including `/api/v1`
- `INTERNAL_APP_URL` — base URL of this app

CI: `.github/workflows/frontend.yml` runs install, lint (non-blocking), type-check, tests, and build. Deployment is handled by Vercel connected to GitHub.
