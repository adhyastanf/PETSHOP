# Oyen

Multi-vendor marketplace for pet products and pet services.

Oyen allows customers to purchase pet products and book services such as grooming and vaccination from registered petshop partners.

## Applications

- `PETSHOP-UI` - Next.js frontend
- `PETSHOP-API` - Spring Boot backend

## Documentation

Full project documentation is available in `docs/`.

Important entry points:

- `AGENTS.md` - operating instructions for AI coding agents
- `docs/README.md` - documentation map and navigation index
- `docs/PROJECT_CONTEXT.md` - canonical project context and source-of-truth hierarchy
- `docs/FEATURE_KNOWLEDGE.md` - complete MVP feature specification
- `docs/DATABASE_KNOWLEDGE.md` - canonical database/table specification
- `docs/BUSINESS_RULES.md` - business invariants that implementations must preserve
- `docs/architecture/STATE_MACHINES.md` - valid lifecycle/status transitions
- `docs/architecture/ARCHITECTURE.md` - overall system architecture
- `docs/architecture/BACKEND_ARCHITECTURE.md` - Spring Boot architecture conventions
- `docs/architecture/FRONTEND_ARCHITECTURE.md` - Next.js architecture and state-management conventions
- `docs/api/API_CONTRACT.md` - API conventions and response/error standards
- `docs/api/API_ENDPOINT_CATALOG.md` - planned MVP endpoint catalog
- `docs/api/AUTHORIZATION_MATRIX.md` - roles, permissions, ownership, and scope
- `docs/implementation/IMPLEMENTATION_ROADMAP.md` - recommended development order
- `docs/implementation/USER_STORIES.md` - implementable MVP user stories
- `docs/implementation/ACCEPTANCE_CRITERIA.md` - reusable acceptance requirements
- `docs/implementation/DEFINITION_OF_DONE.md` - completion requirements
- `docs/frontend/PAGE_CATALOG.md` - planned customer, merchant, and admin pages
- `docs/integrations/INTEGRATION_SPEC.md` - payment, shipping, storage, OAuth, and notification integration boundaries
- `docs/engineering/CODING_STANDARDS.md` - engineering conventions
- `docs/engineering/TEST_CASES.md` - critical MVP test scenarios
- `docs/engineering/SECURITY.md` - application security requirements

AI coding agents must start with `AGENTS.md`. Human developers should use this README for setup and `docs/README.md` to navigate the full specification.

## Folders

- `PETSHOP-UI` - Next.js frontend
- `PETSHOP-API` - Spring Boot backend
- `docs` - product, architecture, API, implementation, frontend, integration, engineering, and operations documentation
- `scripts` - local development and database utility scripts

## Prerequisites

Frontend:

- Node.js
- npm

Backend:

- Java 21
- Maven
- PostgreSQL

Check your installed tools:

```powershell
node -v
npm -v
java -version
mvn -version
```

Current backend requirement status on this machine:

- Java 21 is installed at `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`
- Maven 3.9.16 is installed at `C:\Tools\apache-maven-3.9.16`
- If `java` or `mvn` is still not found, close and reopen PowerShell so it reloads `JAVA_HOME` and `Path`

## Install Backend Tools On Windows

Install Java 21:

```powershell
winget install EclipseAdoptium.Temurin.21.JDK
```

Install Maven with PowerShell:

```powershell
$version="3.9.16"; $dir="C:\Tools"; New-Item -ItemType Directory -Force $dir; Invoke-WebRequest "https://dlcdn.apache.org/maven/maven-3/$version/binaries/apache-maven-$version-bin.zip" -OutFile "$env:TEMP\apache-maven.zip"; Expand-Archive "$env:TEMP\apache-maven.zip" -DestinationPath $dir -Force; [Environment]::SetEnvironmentVariable("MAVEN_HOME", "$dir\apache-maven-$version", "User"); [Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$dir\apache-maven-$version\bin", "User")
```

After installing Java or Maven, close and reopen the terminal.

Verify again:

```powershell
java -version
mvn -version
```

## Run Frontend

Install dependencies if needed:

```powershell
cd C:\PETSHOP\PETSHOP\PETSHOP-UI
npm.cmd install
```

Set up environment variables (first time only):

```powershell
Copy-Item .env.example .env.local
```

The default `.env.local` contains:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Start the Next.js development server:

```powershell
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Available starter pages:

- `http://localhost:3000/customer/home`
- `http://localhost:3000/mitra/home`
- `http://localhost:3000/admin/home`

## Setup Database (first time only)

### Step 1: Install PostgreSQL

```powershell
winget install PostgreSQL.PostgreSQL.16
```

Or use Docker:

```powershell
docker run -d --name petshop-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=Petshop@2026 -e POSTGRES_DB=petshop -p 5432:5432 postgres:16-alpine
```

If using Docker, skip Step 2 (database is created automatically).

### Step 2: Create the database

Open DBeaver, connect to PostgreSQL with:

- **Host:** localhost
- **Port:** 5432
- **Username:** postgres
- **Password:** Petshop@2026

Then open a SQL Editor and run:

```sql
CREATE DATABASE petshop;
```

That's it. No extra users or grants needed — the app connects as `postgres`.

### Step 3: Start the API

```powershell
cd C:\PETSHOP\PETSHOP\PETSHOP-API
mvn spring-boot:run
```

Flyway automatically runs all migration scripts on startup:

- `V1__init.sql` — creates all 87 tables (users, merchants, products, orders, bookings, payments, etc.)
- `V2__seed_data.sql` — inserts reference data (roles, permissions, pet types, categories, etc.)

You do NOT need to run these SQL files manually. Just start the API and the database is ready.

### Database credentials

| Setting | Value |
|---------|-------|
| Host | localhost |
| Port | 5432 |
| Database | petshop |
| Username | postgres |
| Password | Petshop@2026 |

These are configured in `PETSHOP-API/src/main/resources/application.yml`. Change them there if your PostgreSQL uses different credentials.

### Seed data (inserted automatically)

The V2 migration inserts reference/lookup data needed for the app to function:

| Table | Data |
|-------|------|
| `roles` | 8 roles (SUPER_ADMIN, ADMIN, CUSTOMER, PETSHOP_OWNER, PETSHOP_ADMIN, PETSHOP_STAFF, GROOMER, VETERINARIAN) |
| `permissions` | 42 permissions across 11 modules |
| `role_permissions` | Role-permission assignments for all 8 roles |
| `pet_types` | Dog, Cat, Bird, Fish, Reptile, Small Animal |
| `pet_breeds` | 10 dog breeds + 10 cat breeds |
| `product_categories` | 6 parent categories + 17 subcategories |
| `service_categories` | Grooming, Vaccination, Veterinary Consultation, Dental Care, Boarding |
| `vaccine_types` | 6 dog vaccines + 5 cat vaccines |
| `system_configurations` | Checkout expiration, slot hold duration, withdrawal minimum, commission %, review window |
| `shipping_providers` | Biteship (aggregator) |
| `payment_methods` | QRIS, Bank Transfer (BCA/BNI/BRI/Mandiri), GoPay, ShopeePay, DANA |

No user accounts are seeded — user registration will be implemented as a feature.

## Run Backend API

Start the Spring Boot API (PostgreSQL must be running):

```powershell
cd C:\PETSHOP\PETSHOP\PETSHOP-API
mvn spring-boot:run
```

If PostgreSQL is not installed/running yet, use local smoke-test mode:

```powershell
cd C:\PETSHOP\PETSHOP\PETSHOP-API
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

This starts the API without database, JPA, or Flyway so you can test the health endpoint first.

If PowerShell says `mvn` is not recognized, either close and reopen PowerShell, or run this once in the current terminal:

```powershell
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
$env:Path="$env:JAVA_HOME\bin;C:\Tools\apache-maven-3.9.16\bin;$env:Path"
mvn -version
mvn spring-boot:run
```

For local smoke-test mode with the same PATH fix:

```powershell
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
$env:Path="$env:JAVA_HOME\bin;C:\Tools\apache-maven-3.9.16\bin;$env:Path"
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

Open the health check:

```text
http://localhost:8080/api/v1/health
```

Expected response:

```json
{
  "status": "UP",
  "service": "PETSHOP-API",
  "timestamp": "..."
}
```

Database environment variables can be changed if needed:

```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/petshop"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="Petshop@2026"
```

## CORS

The API allows requests from `http://localhost:3000` by default (the Next.js dev server).

To allow additional origins, set the environment variable before starting:

```powershell
$env:CORS_ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
```

## Tech Stack (current)

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, TanStack Query

**Backend:** Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA, Flyway, PostgreSQL
