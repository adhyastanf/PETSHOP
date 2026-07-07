# PETSHOP-API

Backend starter for Pet Marketplace.

## Stack

- Java 21
- Spring Boot 3
- Spring Web
- Spring Security
- Spring Data JPA
- Flyway
- PostgreSQL

## Getting Started

```bash
mvn spring-boot:run
```

The API starts on [http://localhost:8080](http://localhost:8080).

Health check:

```bash
GET /api/v1/health
```

Database connection can be configured with:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
