# Pet Marketplace — Development Guide

> **For human developers only.** This document is a reference guide for developers working on the project. AI agents should not read or use this file for implementation decisions — refer to `AGENTS.md` and canonical docs instead.

Step-by-step guide for building features end-to-end across backend and frontend.

---

## Backend Flow (Spring Boot)

```
Database (PostgreSQL)
    ↓
Migration (Flyway SQL) — defines/alters tables
    ↓
Entity (JPA) — Java class mapped to table
    ↓
Repository — interface to query the database
    ↓
Service — business logic, validation, orchestration
    ↓
DTO — shapes what the API sends/receives
    ↓
Controller — HTTP endpoint
    ↓
Client (Frontend)
```

---

### Step 1: Database Migration

Location: `PETSHOP-API/src/main/resources/db/migration/`

Create a new SQL file with incremental version:

```sql
-- V4__create_pets_table.sql
CREATE TABLE pets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    name            VARCHAR(100) NOT NULL,
    species         VARCHAR(50) NOT NULL,
    breed           VARCHAR(100),
    date_of_birth   DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pets_user_id ON pets(user_id);
```

Rules:
- Never modify released migrations — create a new version
- Always add indexes for foreign keys and frequently queried columns
- Use UUID for public IDs, TIMESTAMPTZ for timestamps

---

### Step 2: Entity

Location: `PETSHOP-API/src/main/java/com/petshop/api/{feature}/domain/`

```java
@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String species;

    private String breed;

    private LocalDate dateOfBirth;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }

    // getters, setters, builder
}
```

Rules:
- Entity maps 1:1 to a database table
- Never expose entity directly to the client
- Use `@PrePersist` for auto-set timestamps

---

### Step 3: Repository

Location: `PETSHOP-API/src/main/java/com/petshop/api/{feature}/persistence/`

```java
public interface PetRepository extends JpaRepository<Pet, UUID> {

    List<Pet> findByUserId(UUID userId);
    // Spring generates: SELECT * FROM pets WHERE user_id = ?

    Optional<Pet> findByIdAndUserId(UUID id, UUID userId);
    // SELECT * FROM pets WHERE id = ? AND user_id = ?

    boolean existsByIdAndUserId(UUID id, UUID userId);
}
```

Rules:
- Spring Data generates SQL from method names
- For complex queries use `@Query("SELECT ...")`
- Repository only handles data access — no business logic

---

### Step 4: Service

Location: `PETSHOP-API/src/main/java/com/petshop/api/{feature}/application/`

```java
// Interface
public interface PetService {
    PetResponse createPet(UUID userId, CreatePetRequest request);
    List<PetResponse> getMyPets(UUID userId);
}

// Implementation
@Service
@Transactional
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;

    @Override
    public PetResponse createPet(UUID userId, CreatePetRequest request) {
        Pet pet = Pet.builder()
                .userId(userId)
                .name(request.name())
                .species(request.species())
                .breed(request.breed())
                .dateOfBirth(request.dateOfBirth())
                .build();

        pet = petRepository.save(pet);

        return mapToResponse(pet);
    }

    @Override
    public List<PetResponse> getMyPets(UUID userId) {
        return petRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PetResponse mapToResponse(Pet pet) {
        return new PetResponse(
            pet.getId(),
            pet.getName(),
            pet.getSpecies(),
            pet.getBreed(),
            pet.getDateOfBirth()
        );
    }
}
```

Rules:
- All business logic lives here (validation, state checks, orchestration)
- Service returns DTOs, never entities
- Use `@Transactional` for write operations
- Throw domain exceptions for business rule violations

---

### Step 5: DTOs

Location: `PETSHOP-API/src/main/java/com/petshop/api/{feature}/api/dto/`

```java
// Request — what the client sends
public record CreatePetRequest(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Size(max = 50) String species,
    @Size(max = 100) String breed,
    LocalDate dateOfBirth
) {}

// Response — what the client receives
public record PetResponse(
    UUID id,
    String name,
    String species,
    String breed,
    LocalDate dateOfBirth
) {}
```

Rules:
- Use Java records for DTOs (immutable)
- Add Jakarta validation annotations on request DTOs
- Never include passwordHash, internal IDs, or sensitive data in responses

---

### Step 6: Controller

Location: `PETSHOP-API/src/main/java/com/petshop/api/{feature}/api/`

```java
@RestController
@RequestMapping("/api/v1/pets")
public class PetController {

    private final PetService petService;

    @PostMapping
    public ResponseEntity<PetResponse> create(@Valid @RequestBody CreatePetRequest request) {
        UUID userId = SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User not found"));

        PetResponse response = petService.createPet(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PetResponse>> getMyPets() {
        UUID userId = SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User not found"));

        return ResponseEntity.ok(petService.getMyPets(userId));
    }
}
```

Rules:
- Controller only handles HTTP concerns (status codes, routing, request binding)
- Get current user from SecurityContext, not from request body
- Use `@Valid` to trigger DTO validation
- Return appropriate HTTP status (201 for create, 200 for read)

---

### Step 7: Security Configuration

If the endpoint requires auth (most do), it's already protected by default.
Only add to `SecurityConfig.permitAll()` if the endpoint is public.

---

## Frontend Flow (Next.js)

```
API Endpoint (Backend)
    ↓
Types — TypeScript interfaces matching DTOs
    ↓
Service — functions calling apiClient
    ↓
Hook — TanStack Query (useQuery/useMutation)
    ↓
Page/Component — UI consuming the hook
```

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

Location: `PETSHOP-UI/src/services/`

```typescript
// services/pet-service.ts
import { apiClient } from '@/lib/api-client';
import type { CreatePetRequest, PetResponse } from '@/types/pet';

export const petService = {
  getMyPets(): Promise<PetResponse[]> {
    return apiClient<PetResponse[]>('/pets');
  },

  createPet(data: CreatePetRequest): Promise<PetResponse> {
    return apiClient<PetResponse>('/pets', {
      method: 'POST',
      body: data,
    });
  },
};
```

Rules:
- Use the shared `apiClient` (it handles auth headers + token refresh automatically)
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

Location: `PETSHOP-UI/src/lib/validators/`

```typescript
// lib/validators/pet-validators.ts
import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, 'Nama hewan wajib diisi').max(100),
  species: z.string().min(1, 'Jenis hewan wajib diisi').max(50),
  breed: z.string().max(100).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
});

export type CreatePetFormData = z.infer<typeof createPetSchema>;
```

---

### Step 5: Page / UI Component

Location: `PETSHOP-UI/src/app/(customer)/pets/page.tsx`

```tsx
'use client';

import { useMyPets, useCreatePet } from '@/hooks/use-pets';
import { Button } from '@/components/ui/button';

export default function PetsPage() {
  const { data: pets, isLoading, error } = useMyPets();
  const createMutation = useCreatePet();

  // Loading state
  if (isLoading) return <p>Memuat...</p>;

  // Error state
  if (error) return <p>Gagal memuat data hewan.</p>;

  // Empty state
  if (!pets?.length) return <p>Belum ada hewan terdaftar.</p>;

  return (
    <div>
      <h1>Hewan Peliharaan Saya</h1>

      {/* List */}
      {pets.map((pet) => (
        <div key={pet.id}>
          <p>{pet.name} — {pet.species}</p>
        </div>
      ))}

      {/* Create button example */}
      <Button
        onClick={() => createMutation.mutate({ name: 'Milo', species: 'Cat' })}
        loading={createMutation.isPending}
      >
        Tambah Hewan
      </Button>
    </div>
  );
}
```

Rules:
- Always handle: loading, error, empty, and success states
- Use the hook directly in the page/component
- Never call fetch/apiClient directly from a component — go through hook → service
- Forms should validate with Zod before calling mutation

---

## Complete Feature Checklist

```
Backend:
□ Flyway migration (if new/altered table)
□ Entity class
□ Repository interface
□ Service interface + implementation
□ Request/Response DTOs with validation
□ Controller
□ Exception handler (if custom errors)
□ SecurityConfig (permit or require auth)

Frontend:
□ TypeScript types (matching DTOs)
□ Service file (calling apiClient)
□ Hook (useQuery / useMutation)
□ Zod validator (for forms)
□ Page/Component (consuming the hook)
□ Loading / error / empty states

Testing:
□ Backend: integration test for the endpoint
□ Frontend: test for the hook/component behavior
```

---

## Layer Responsibilities

| Layer | Does | Never Does |
|---|---|---|
| Migration | Define/alter DB schema | Business logic |
| Entity | Map columns to Java fields | Expose to client |
| Repository | Data access (queries) | Business decisions |
| Service | Business logic, validation | HTTP or UI concerns |
| DTO | Shape API input/output | Database access |
| Controller | HTTP routing, status codes | Business logic |
| Types (FE) | Define data shapes | API calls |
| Service (FE) | Call API via apiClient | UI rendering |
| Hook (FE) | Manage server state (cache, refetch) | Direct API calls |
| Page (FE) | Render UI, handle user interaction | Business logic |
