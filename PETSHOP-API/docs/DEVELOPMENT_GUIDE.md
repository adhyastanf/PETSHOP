# Oyen — API Development Guide

> **For human developers only.** This document is a reference guide for developers working on the project. AI agents should not read or use this file for implementation decisions — refer to `AGENTS.md` and canonical docs instead.

Step-by-step guide for building a backend feature end-to-end. The web client flow is in the UI project (`PETSHOP-UI/docs/DEVELOPMENT_GUIDE.md`).

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

## Backend Feature Checklist

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
□ API_CONTRACT.md updated (endpoints, errors)

Testing:
□ Integration test for the endpoint (authorized, unauthorized, not found, invalid input)
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

---

## Cloud Development Environment

### Official Stack

| Service | Provider | Tier | Purpose |
|---------|----------|------|---------|
| Repository | GitHub | Free | Source control, CI/CD |
| Frontend | Vercel | Free | Next.js hosting |
| Backend | Koyeb | Free | Spring Boot hosting |
| Database | Supabase | Free | PostgreSQL |
| Storage | Local filesystem | — | File uploads (production: S3/R2) |

### Deployment Topology

```text
GitHub (monorepo)
├── PETSHOP-UI/ → Vercel (auto-deploy from dev branch)
└── PETSHOP-API/ → Koyeb (deploy from dev branch)
                    ↓
              Supabase PostgreSQL
```


The frontend (Vercel) configuration is documented in `PETSHOP-UI/docs/DEVELOPMENT_GUIDE.md`.

### Koyeb Configuration

| Setting | Value |
|---------|-------|
| Root Directory | `PETSHOP-API` |
| Builder | Maven |
| Runtime | Java 21 |
| Port | `PORT` env var (Koyeb sets this) |
| Health Check | `/actuator/health` |

Environment variables to set in Koyeb dashboard:
- `DATABASE_URL` — Supabase JDBC connection string
- `DATABASE_USERNAME` — Supabase DB user
- `DATABASE_PASSWORD` — Supabase DB password
- `JWT_SECRET` — Random 32+ character string
- `CORS_ALLOWED_ORIGINS` — Vercel frontend URL
- `PORT` — Set by Koyeb automatically
- `SPRING_PROFILES_ACTIVE` — `default`

### Supabase PostgreSQL

| Setting | Value |
|---------|-------|
| Provider | Supabase |
| Engine | PostgreSQL 15+ |
| Auth | Database password (not Supabase Auth) |
| SSL | Required for remote connections |

Connection string format:
```
jdbc:postgresql://<host>:5432/postgres?sslmode=require
```

Flyway works normally with Supabase PostgreSQL. No special configuration needed.

Do NOT use:
- Supabase Auth (we have our own JWT auth)
- Supabase Storage (we use StorageService abstraction)
- Supabase SDKs (direct PostgreSQL connection only)

### Git Branch Strategy

```text
feature/* → Pull Request → dev → auto-deploy to shared dev environment
                            ↓
                          main → production deployment
```

| Branch | Purpose | Deployment |
|--------|---------|-----------|
| `feature/*` | Feature development | None |
| `dev` | Integration branch | Auto-deploy to dev environment |
| `main` | Production-ready | Production deployment |

Rules:
- Never push directly to `main`
- All work goes through `dev` via PR
- `dev` auto-deploys to shared development environment
- `main` is deployed only after QA on dev

### CI/CD (GitHub Actions)

Two workflows trigger on push/PR to `dev` or `main`:

- `.github/workflows/backend.yml` — triggers on `PETSHOP-API/**` changes
- `.github/workflows/frontend.yml` — triggers on `PETSHOP-UI/**` changes

Both run build + tests. Deployment is handled by Vercel/Koyeb directly (connected to GitHub).
