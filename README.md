# PETSHOP

Pet Marketplace monorepo based on `01_Product_Vision_Document.md`.

## Folders

- `PETSHOP-UI` - Next.js frontend
- `PETSHOP-API` - Spring Boot backend

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

## Run Backend API

Make sure PostgreSQL is running and create the default database/user:

```sql
CREATE DATABASE petshop;
CREATE USER petshop WITH PASSWORD 'petshop';
GRANT ALL PRIVILEGES ON DATABASE petshop TO petshop;
```

Then start the Spring Boot API:

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
$env:DATABASE_USERNAME="petshop"
$env:DATABASE_PASSWORD="petshop"
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
