# Oyen — UI Patterns

Canonical page composition patterns. Complements `DESIGN_SYSTEM.md`.

---

## Purpose

| Document | Defines |
|----------|---------|
| `DESIGN_SYSTEM.md` | Reusable components, tokens, colors, typography, spacing, individual component specs |
| `UI_PATTERNS.md` | How components are assembled into complete pages, navigation flow, screen hierarchy, UX composition |

`DESIGN_SYSTEM.md` = building blocks.
`UI_PATTERNS.md` = blueprints for assembling those blocks into screens.

---

## Global Layout Principles

- **Mobile-first:** Design for mobile, progressively enhance for tablet/desktop.
- **Consistent page hierarchy:** Header → Content → Footer/Bottom Nav (never deviate).
- **Visual hierarchy:** Primary action prominent, secondary muted, destructive isolated.
- **Section ordering:** Most important content first, supporting content below.
- **Spacing:** Use `space-8` to `space-10` between major sections. See DESIGN_SYSTEM.md spacing tokens.
- **Sticky elements:** Header (top), Bottom Nav (bottom, mobile), Checkout CTA (bottom, mobile), Sidebar (desktop).
- **Scroll behavior:** Content scrolls behind sticky header/nav. No horizontal scroll on page level.
- **Max content width:** `max-w-7xl` (1280px), centered on wide screens.
- **Page padding:** `space-4` (mobile), `space-6`–`space-8` (desktop).

---

## Navigation Patterns

### Customer

| Breakpoint | Navigation |
|------------|-----------|
| Mobile | App Header (top) + Bottom Navigation (bottom) |
| Desktop | App Header with expanded search, no bottom nav |

Flow: Bottom tabs for top-level sections → App Header back button for sub-pages.

### Merchant

| Breakpoint | Navigation |
|------------|-----------|
| Mobile | App Header + hamburger → overlay sidebar |
| Desktop | Persistent sidebar (288px) + top header |

### Admin

Same as Merchant pattern. Different menu items.

### Common Rules

- **Breadcrumb:** Desktop detail pages only. Reference DESIGN_SYSTEM.md Breadcrumb spec.
- **Back navigation:** Mobile sub-pages show back arrow in header (replaces logo).
- **Search-first:** Search is always accessible — icon in header (mobile), expanded bar (desktop).

---

## Authentication Pages

Standard centered card layout for all auth screens.

### Layout

```
Background: page Background color
Card: centered, max-w-md, Surface, radius-lg, shadow-md
Logo: stacked logo, centered above card
```

### Pages

| Page | Content |
|------|---------|
| Login | Email + Password + Remember Me checkbox + Submit + Link to Register |
| Register | Full Name + Email + Phone (opsional) + Password + Confirm Password + Submit + Link to Login |
| Forgot Password | Email + Submit + Link to Login |
| Reset Password | New Password + Confirm Password + Submit |
| Email Verification | Status message + Resend button |
| Success Page | Success icon + Title + Description + CTA button |
| Error Page | Error icon + Title + Description + Retry button |

### Rules

- No header/footer on auth pages
- Redirect authenticated users away (to their role-based home)
- Remember Me: extends refresh token duration
- Show password toggle on all password fields
- Validation: inline errors below fields (Zod)

---

## Home Page Pattern

Canonical section order for customer home:

```
[App Header]
[Search Bar (prominent, hero-style)]
[Promotion Banner (carousel, optional)]
[Quick Categories (horizontal scroll icons)]
[Nearby Merchants (horizontal card scroll, location-dependent)]
[Popular Services (horizontal card scroll)]
[Recommended Products (grid 2-col mobile, 4-col desktop)]
[Recommended Services (grid)]
[Footer (desktop only)]
[Bottom Navigation (mobile)]
```

### Rules

- Search bar is the first interactive element (prominent placement)
- Promotion Banner: auto-scroll, dots indicator, swipeable
- Categories: max 8 visible, circular icons with label below
- Horizontal scrolls: show 2.5 items (hint of more), snap scroll
- Product/Service grids: use canonical Product Card / Service Card
- Sections are optional — hide if no data (no empty section headers)

---

## Explore Pattern

Full marketplace browsing experience:

```
[App Header with Search]
[Category tabs (horizontal scroll)]
[Filter chips row (horizontal scroll)]
[Sort dropdown (right-aligned)]
[Result count ("150 produk ditemukan")]
[Content Grid: Product Cards / Service Cards / Merchant Cards]
[Pagination (desktop) / Infinite Scroll (mobile)]
```

### Rules

- Tabs switch between: Produk, Layanan, Toko
- Filter chips: active filters visible, "Hapus semua" at end
- Full filter panel: bottom sheet (mobile), side drawer (desktop)
- Sort: "Terbaru", "Harga ↑", "Harga ↓", "Rating", "Terlaris"
- Grid: 2 col (mobile), 3 col (tablet), 4 col (desktop)
- Infinite scroll on mobile, pagination on desktop

---

## Merchant Page Pattern

```
[Merchant Header: banner + logo + name + verified badge]
[Stats row: rating, review count, product count]
[Location + Operating Hours (expandable)]
[Tabs: Produk | Layanan | Ulasan | Info]
[Tab Content: grid/list of items]
```

### Rules

- Banner: 16:9 aspect, full-width
- Logo: overlapping banner bottom, avatar-lg, radius-full
- Tabs: sticky below header on scroll
- Products tab: Product Card grid
- Services tab: Service Card grid
- Reviews tab: Review Card list
- Info tab: description, address, hours, branches

---

## Product Detail Pattern

```
[Image Gallery (swipeable, dot indicators)]
[Product Name — H2]
[Price Component (discount if applicable)]
[Variant Selection (chips/buttons)]
[Description (collapsible if long)]
[Specifications (key-value table, optional)]
[Reviews Section (summary + list, "Lihat semua" link)]
[Merchant Card (mini, linked)]
[Recommendations ("Produk serupa" grid)]
[Sticky Bottom Bar: Quantity + Add to Cart button]
```

### Rules

- Gallery: full-width on mobile, constrained on desktop
- Sticky bottom bar: mobile only. Desktop: inline button.
- Variant unavailable: chip disabled with strikethrough
- Out of stock: disable Add to Cart, show "Habis" badge

---

## Service Detail Pattern

```
[Gallery / Hero Image]
[Service Name — H2]
[Price Component (range if variable)]
[Description]
[Available Branches (selectable list)]
[Available Staff (optional, shown after branch selection)]
[Schedule / Available Slots (calendar + time grid)]
[Reviews Section]
[Sticky Bottom Bar: "Book Sekarang" button]
```

### Rules

- Branch selection first → reveals staff + schedule
- Calendar: shows available dates (highlighted), disabled past/full dates
- Time slots: grid of available times, selected = Primary bg
- Book button: disabled until branch + date + slot selected


---

## Cart Pattern

```
[App Header: "Keranjang"]
[Merchant Group A]
  [Merchant name + checkbox (select all)]
  [Cart Item 1]
  [Cart Item 2]
[Merchant Group B]
  [Merchant name + checkbox]
  [Cart Item 3]
[Voucher row: "Gunakan voucher" → opens voucher sheet]
[Sticky Bottom: Total + Checkout button]
```

### Rules

- Items grouped by merchant
- Each item: image + name + variant + qty control + price + remove
- Service items show date/time/pet instead of quantity
- Select/deselect items for checkout
- Voucher: one per checkout, applied after selection
- Empty cart: canonical Empty State ("Keranjang kosong")
- Checkout button shows selected item count + total

---

## Checkout Pattern

```
[Stepper: Pengiriman → Pembayaran → Konfirmasi]
[Shipping Section]
  [Address Card (selected, changeable)]
  [Shipping options per merchant group]
[Booking Section (if services in cart)]
  [Date/Time/Pet confirmation per service]
[Voucher Section]
  [Applied voucher or "Tambah Voucher" button]
[Payment Section]
  [Payment method selection]
[Order Summary Card (sticky desktop, bottom sheet mobile)]
  [Checkout Summary Card component]
[Confirm Button: "Bayar Rp xxx"]
```

### Rules

- Stepper indicates progress
- Address: show default, tap to change (bottom sheet with address list)
- Shipping: radio buttons per courier option per merchant
- Payment: radio buttons or expandable sections per method
- Summary: updates live as selections change
- Confirm: disabled until all required fields selected

---

## Order Pattern

### Order List

```
[App Header: "Pesanan Saya"]
[Status tabs (horizontal scroll): Semua | Dikemas | Dikirim | Selesai | Batal]
[Order Cards (vertical list)]
[Empty State if no orders in tab]
```

### Order Detail

```
[Status badge + Timeline]
[Merchant info]
[Item list (product cards mini)]
[Shipping info + tracking number + courier]
[Price breakdown]
[Action buttons: Konfirmasi Terima / Ajukan Pengembalian / Beri Ulasan]
```

### Tracking

```
[Courier + tracking number (copyable)]
[Timeline component: shipping events]
[Map (future, optional)]
```

---

## Booking Pattern

### Booking List

```
[App Header: "Booking Saya"]
[Status tabs: Semua | Akan Datang | Berlangsung | Selesai | Batal]
[Booking Cards (vertical list)]
[Empty State if no bookings]
```

### Booking Detail

```
[Status badge]
[Service name + branch + date/time]
[Pet info]
[Staff assigned (if known)]
[Price breakdown]
[Timeline (status history)]
[Action buttons: Batalkan / Check-in QR / Beri Ulasan]
```

---

## Customer Profile Pattern

```
[App Header: "Akun"]
[User Profile Card (avatar + name + email)]
[Menu List:]
  - Profil Saya → Profile edit page
  - Hewan Saya → Pet list
  - Alamat → Address list
  - Pesanan → Order list
  - Booking → Booking list
  - Wishlist → Favorites
  - Pengaturan → Settings
  - Keluar → Logout confirmation
```

### Rules

- Menu items: icon + label + chevron right
- Each item navigates to its respective page
- Logout: shows confirmation dialog before executing
- Profile card at top is tappable → goes to profile edit

---

## Pet Management Pattern

### Pet List

```
[App Header: "Hewan Saya"]
[Pet Cards (grid 2-col or list)]
[FAB: "Tambah Hewan" (mobile) / Button (desktop)]
[Empty State: "Belum ada hewan"]
```

### Pet Detail

```
[Pet photo (large, top)]
[Name + Species + Breed]
[Info grid: gender, age, weight, color, microchip, sterilized]
[Tabs: Info | Vaksinasi | Riwayat Medis]
[Vaccination tab: Vaccination Card list + Timeline]
[Action buttons: Edit / Hapus]
```


---

## Merchant Dashboard Pattern

```
[Sidebar (desktop) / Header + Hamburger (mobile)]
[Page Content Area:]
```

### Pages

| Page | Content Pattern |
|------|----------------|
| Dashboard | KPI Cards row + Revenue chart + Recent orders table |
| Pesanan | List Page Pattern (tabs by status) |
| Produk | List Page Pattern + FAB/button to create |
| Layanan | List Page Pattern + create button |
| Inventori | Table with filters (branch, variant) |
| Booking | List Page Pattern (tabs by status) |
| Ulasan | Review Card list + reply action |
| Keuangan | KPI Cards + Ledger table + Withdrawal button |
| Pengaturan | Form Pattern (merchant profile, branches, hours) |

### Rules

- Sidebar active item matches current page
- All tables follow canonical Table component
- All forms follow canonical Form Layout
- Empty states use canonical Empty State

---

## Admin Dashboard Pattern

```
[Sidebar (desktop) / Header + Hamburger (mobile)]
[Page Content Area:]
```

### Pages

| Page | Content Pattern |
|------|----------------|
| Dashboard | Platform KPI Cards + Charts + Alerts |
| Users | Table (search + filter by role/status) |
| Merchants | Table (filter by verification status) + detail drawer |
| Pembayaran | Table (filter by status, date) |
| Disputes | List with status tabs + detail page |
| Marketing | Vouchers/campaigns table + create form |
| Laporan | Charts + export buttons |
| Audit | Timeline / table of actions |

---

## List Page Pattern

Reusable for any list page:

```
[Header: Title + Create/Action button (right)]
[Search bar + Filter chips]
[Sort dropdown (right) + Result count (left)]
[Content: Card grid OR Table]
[Pagination (desktop) / Infinite scroll (mobile)]
[Empty State (when no results)]
```

---

## Detail Page Pattern

Reusable for any detail view:

```
[Breadcrumb (desktop only)]
[Header: Title + Status Badge + Action buttons (right)]
[Content: Info sections / Tabs]
[Related data (sub-lists, timeline)]
[Action bar (bottom sticky on mobile)]
```

---

## Form Pattern

Reusable for any form page:

```
[Header: Title + Cancel/Back]
[Card containing form:]
  [Section label (if multiple sections)]
  [Input fields (Form Layout from DESIGN_SYSTEM.md)]
  [Validation errors inline]
[Submit bar: Cancel (ghost) + Submit (primary)]
  [Mobile: sticky bottom]
  [Desktop: right-aligned within card]
```

### Confirmation Flow

After submit success:
- Simple action: Toast notification + stay on page or redirect
- Important action: Success Dialog + redirect

---

## Search Pattern

### Global Search

```
[Search overlay (full screen mobile, dropdown desktop)]
[Search input (auto-focused)]
[Recent searches (up to 5)]
[Suggestions (as user types, debounced)]
[Results grouped: Produk | Layanan | Toko]
[Each result: mini card, tappable]
["Lihat semua hasil" link per group]
```

### Category/Filtered Search

```
[Category header or filter context]
[Search bar within scope]
[Results grid with Explore Pattern]
```

### Empty Result

```
[Canonical Empty State]
[Title: "Tidak ditemukan"]
[Description: "Coba kata kunci lain atau hapus filter"]
[CTA: "Hapus Filter" or "Kembali"]
```

---

## Filter Pattern

### Mobile (Bottom Sheet)

```
[Handle bar]
[Filter title + "Reset" link]
[Filter sections (collapsible):]
  - Kategori (checkbox list)
  - Harga (range slider or min/max inputs)
  - Rating (star buttons)
  - Lokasi (radius selector)
  - Ketersediaan (toggle)
[Sticky bottom: "Tampilkan X hasil" button]
```

### Desktop (Side Panel or Dropdown)

```
[Filter sections stacked vertically]
[Apply button at bottom]
```

### Rules

- Single select: radio buttons
- Multi select: checkboxes
- Price: min/max number inputs or range slider
- Location: based on branch proximity
- Active filters: shown as chips above results
- Reset: clears all, updates results immediately

---

## Empty State Pattern

One pattern, never deviate:

```
[Lucide icon (size-12, Secondary 40% opacity)]
[Title — H3, space-4 top]
[Description — Body, Secondary, space-2 top, centered, max-w-xs]
[Primary CTA button (optional, space-4 top)]
[Secondary link (optional, space-2 top)]
```

Contextual examples:
- Cart: `ShoppingCart` + "Keranjang kosong" + "Mulai belanja"
- Orders: `Package` + "Belum ada pesanan" + "Lihat produk"
- Pets: `PawPrint` + "Belum ada hewan" + "Tambah hewan"
- Search: `Search` + "Tidak ditemukan" + "Coba kata kunci lain"

---

## Error Pattern

| Type | Icon | Title | Action |
|------|------|-------|--------|
| Network Error | `WifiOff` | "Koneksi terputus" | "Coba Lagi" button |
| 404 Not Found | `FileQuestion` | "Halaman tidak ditemukan" | "Kembali" button |
| 403 Forbidden | `ShieldX` | "Akses ditolak" | "Kembali" + "Beranda" |
| 500 Server Error | `ServerCrash` | "Terjadi kesalahan" | "Coba Lagi" button |
| Timeout | `Timer` | "Request timeout" | "Coba Lagi" button |

Layout: same as Empty State pattern (centered, icon + title + description + action).

---

## Loading Pattern

| Context | Method |
|---------|--------|
| Full page (first load) | Centered spinner (24px) |
| Content section | Skeleton matching content shape |
| Button action | Button loading state (spinner replaces icon) |
| Inline action | Small spinner (16px) beside element |
| Data refetch | Keep stale content visible, subtle spinner indicator |
| Image loading | Skeleton rectangle, fade-in on load |

Rules: See DESIGN_SYSTEM.md Loading State Guidelines for full specs.

---

## Success Pattern

| Context | Method |
|---------|--------|
| Simple CRUD | Toast (top-right): "Berhasil disimpan" |
| Important flow | Success Dialog: icon + title + description + CTA |
| Payment | Full success page: checkmark + amount + order ID + "Lihat Pesanan" |
| Registration | Redirect to home with welcome toast |


---

## Responsive Rules

How each page type adapts:

| Page Type | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Auth | Full-width card | Centered max-w-md | Same as tablet |
| Home | Stacked sections, horizontal scrolls | 2-col grids | 3-4 col grids |
| Explore | 2-col card grid, infinite scroll | 3-col grid | 4-col grid + side filters |
| Detail | Stacked sections | 2-col (image + info) | Same, wider |
| Cart | Full-width items | Same | 2-col (items + summary) |
| Checkout | Stacked steps | Same | 2-col (form + summary) |
| Dashboard | Stacked sections, scroll KPIs | 2-col KPIs + charts | Sidebar + full grid |
| List/Table | Card list (no table) | Table (horizontal scroll) | Full table |
| Form | Single column | 2-col fields | Same, max-w-2xl |
| Profile | Stacked menu | Same | Sidebar nav + content |

### Shared Rules

- Bottom Navigation: visible only on mobile (< lg)
- Sidebar: visible only on desktop (≥ lg)
- Sticky CTAs: bottom-fixed on mobile, inline on desktop
- Images: full-width on mobile, constrained on desktop
- Horizontal scrolls: snap-scroll on mobile, grid on desktop
- Modals: bottom sheet on mobile, centered dialog on desktop

---

## UX Consistency Rules

Every screen must reuse:

| Element | Canonical Source |
|---------|----------------|
| Header | App Header (DESIGN_SYSTEM.md) |
| Navigation | Bottom Nav / Sidebar (DESIGN_SYSTEM.md) |
| Cards | Product/Service/Order/Booking Card (DESIGN_SYSTEM.md) |
| Buttons | Button variants (DESIGN_SYSTEM.md) |
| Inputs | Form Layout (DESIGN_SYSTEM.md) |
| Typography | Type scale (DESIGN_SYSTEM.md) |
| Spacing | Spacing tokens (DESIGN_SYSTEM.md) |
| Empty States | Empty State component (DESIGN_SYSTEM.md) |
| Loading States | Loading pattern (this document + DESIGN_SYSTEM.md) |
| Error States | Error pattern (this document) |
| Success States | Success pattern (this document) |
| Status Badges | Status System (DESIGN_SYSTEM.md) |
| Pagination | Pagination component (DESIGN_SYSTEM.md) |

**Never** create a one-off layout that contradicts these patterns.
**Never** use different card styles on different pages for the same data.
**Never** invent new empty/loading/error states.

---

## AI Rules

When generating new screens:

1. **Check this document first** for an existing page pattern that matches.
2. **Reuse** the closest pattern — adapt content, not structure.
3. **Reuse components** from DESIGN_SYSTEM.md — never invent new ones.
4. **Prefer consistency over novelty** — every screen must feel like it belongs.
5. **If no pattern exists**, compose from the closest existing patterns (List + Detail, Form + Success, etc.).
6. **If a genuinely new pattern is needed**, add it to this document before implementing.
7. **Never redesign** existing pages to look different from this spec.

The application must feel like a single cohesive product, not a collection of independently designed pages.
