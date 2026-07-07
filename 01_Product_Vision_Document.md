# Pet Marketplace
## 01 - Product Vision Document (PVD)

**Version:** 1.0  
**Status:** Draft

---

# Document Information

| Item | Value |
|------|------|
| Project Name | Pet Marketplace |
| Product Type | Multi-vendor Marketplace |
| Business Model | Marketplace Murni (Platform sebagai perantara) |
| Backend | Spring Boot 3 |
| Frontend | Next.js (React + TypeScript) |
| Database | PostgreSQL |
| Mobile (Future) | React Native |

---

# 1. Executive Summary

Pet Marketplace adalah platform marketplace khusus industri hewan peliharaan di Indonesia yang mempertemukan pemilik hewan dengan berbagai petshop dan penyedia layanan dalam satu aplikasi.

Platform tidak memiliki stok maupun jasa sendiri. Seluruh transaksi dilakukan antara customer dan petshop, sedangkan platform memperoleh pendapatan dari komisi transaksi, fitur promosi, dan layanan premium.

---

# 2. Vision

Menjadi platform digital terbesar di Indonesia yang menghubungkan seluruh ekosistem pet melalui pengalaman belanja produk, pemesanan layanan, dan pengelolaan hewan peliharaan yang mudah, aman, dan terpercaya.

# 3. Mission

- Mendigitalisasi petshop lokal.
- Memudahkan pemilik hewan menemukan produk dan layanan.
- Menyediakan sistem booking online.
- Menjadi pusat data kebutuhan hewan peliharaan.
- Membantu pertumbuhan UMKM petshop.

---

# 4. Problem Statement

## Customer

- Sulit mencari petshop terpercaya.
- Booking grooming masih melalui WhatsApp.
- Tidak ada aplikasi yang menggabungkan produk dan jasa.
- Riwayat vaksin dan grooming tidak terdokumentasi.
- Sulit membandingkan harga dan ulasan.

## Petshop

- Bergantung pada pelanggan tetap.
- Tidak memiliki sistem booking modern.
- Sulit memasarkan produk secara digital.
- Tidak memiliki dashboard analitik.

---

# 5. Proposed Solution

Platform menyediakan:

- Marketplace produk
- Marketplace jasa
- Booking online
- Pembayaran online
- Chat customer-petshop
- Profil hewan
- Review & rating
- Reminder layanan
- Dashboard petshop
- Dashboard admin

---

# 6. Stakeholders

## Internal
- Product Owner
- UI/UX Designer
- Backend Developer
- Frontend Developer
- QA Engineer
- DevOps

## External
- Customer
- Petshop
- Groomer
- Dokter Hewan
- Payment Gateway
- Kurir

---

# 7. Target Market

## B2C

Pemilik:
- Kucing
- Anjing
- Burung
- Kelinci
- Hamster
- Reptil

## B2B

- Petshop
- Grooming
- Klinik Hewan
- Pet Hotel
- Trainer

---

# 8. Product Scope (MVP)

## Customer
- Registrasi & Login
- Kelola profil
- Kelola hewan
- Cari produk
- Cari layanan
- Keranjang
- Checkout
- Booking
- Pembayaran
- Riwayat transaksi
- Review

## Petshop
- Registrasi
- Verifikasi
- Profil toko
- CRUD produk
- CRUD layanan
- Kelola booking
- Kelola pesanan
- Dashboard

## Admin
- Verifikasi petshop
- Kelola kategori
- Kelola banner
- Kelola voucher
- Moderasi review
- Dashboard

---

# 9. Out of Scope (MVP)

- Telemedicine
- AI Assistant
- Insurance
- Marketplace Adopsi
- IoT
- Loyalty lintas merchant
- Subscription

---

# 10. Business Model

## Revenue

1. Komisi penjualan produk
2. Komisi booking layanan
3. Featured Petshop
4. Featured Product
5. Banner Promotion
6. Subscription Premium
7. Sponsored Search

---

# 11. Success Metrics

## Year 1

- 500 petshop aktif
- 50.000 customer
- 10.000 transaksi/bulan
- Rating aplikasi ≥ 4.7
- Repeat Order ≥ 35%

---

# 12. High Level Modules

1. Authentication
2. Customer Management
3. Pet Management
4. Petshop Management
5. Product Marketplace
6. Service Marketplace
7. Cart
8. Checkout
9. Payment
10. Booking
11. Order
12. Chat
13. Notification
14. Review
15. Search
16. CMS
17. Analytics
18. Administration

---

# 13. Technology Stack

## Backend
- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- Flyway
- JWT

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand

## Database
- PostgreSQL

## Infrastructure
- Docker
- Nginx
- GitHub
- GitHub Actions
- MinIO / S3 Compatible Storage
- Redis (future)
- RabbitMQ (future)

---

# 14. Risks

- Sulit memperoleh petshop pada fase awal.
- Persaingan dengan marketplace umum untuk produk.
- Perlu menjaga kualitas layanan mitra.
- Sinkronisasi jadwal layanan.

---

# 15. Roadmap

## Phase 1
Marketplace Produk + Booking Grooming

## Phase 2
Vaksin, Klinik, Hotel Hewan

## Phase 3
Digital Pet Passport

## Phase 4
Loyalty & Membership

## Phase 5
Community & Social Features

---

# Next Document

Dokumen berikutnya:

**02 - Business Requirement Document (BRD)**

Dokumen ini akan menjelaskan seluruh proses bisnis, aktor, aturan bisnis, dan kebutuhan sistem secara rinci sebagai dasar penyusunan SRS.
