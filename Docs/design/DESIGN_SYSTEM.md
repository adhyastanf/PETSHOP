# Oyen — Design System

Nama aplikasi: **Oyen**
Tagline: Semua Kebutuhan Hewan Peliharaan, Lebih Dekat.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#EA580C` | Buttons, links, active states, brand accent |
| Primary Hover | `#C2410C` | Button hover, pressed states |
| Background | `#FFF7ED` | Page background, app shell |
| Surface | `#FFFFFF` | Cards, modals, inputs, elevated containers |
| Border | `#FED7AA` | Card borders, dividers, input borders |
| Success | `#22C55E` | Success messages, positive status |
| Warning | `#F59E0B` | Warning banners, pending states |
| Error | `#EF4444` | Error messages, destructive actions, validation |
| Info | `#3B82F6` | Informational banners, tooltips |
| Text | `#0F172A` | Primary text, headings |
| Secondary | `#64748B` | Secondary text, labels, placeholders, muted content |

### CSS Variables

```css
:root {
  --color-primary: #EA580C;
  --color-primary-hover: #C2410C;
  --color-background: #FFF7ED;
  --color-surface: #FFFFFF;
  --color-border: #FED7AA;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  --color-text: #0F172A;
  --color-secondary: #64748B;
}
```

---

## Typography Scale

Font family: **Geist Sans** (headings + body), **Geist Mono** (code/data)

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 36px / 2.25rem | 700 | 1.2 | Hero sections, landing |
| H1 | 30px / 1.875rem | 600 | 1.3 | Page titles |
| H2 | 24px / 1.5rem | 600 | 1.35 | Section headings |
| H3 | 20px / 1.25rem | 600 | 1.4 | Subsections, card titles |
| H4 | 16px / 1rem | 600 | 1.5 | Small headings |
| Body | 14px / 0.875rem | 400 | 1.5 | Default body text |
| Body Large | 16px / 1rem | 400 | 1.6 | Descriptions, intros |
| Small | 12px / 0.75rem | 400 | 1.4 | Labels, timestamps, captions |
| XS | 11px / 0.6875rem | 400 | 1.3 | Badges, micro labels |

### Rules

- Headings: color `Text`, font-weight semibold/bold
- Body: color `Text`, font-weight normal
- Muted: color `Secondary`
- Links: color `Primary`, underline on hover
- Max line length: ~75 characters for readability

---

## Spacing System (8pt)

Base unit: **4px**. Use multiples of 4 for all spacing.

| Token | Value | Usage |
|-------|-------|-------|
| space-0 | 0px | — |
| space-1 | 4px | Tight inline gaps |
| space-2 | 8px | Icon-to-text, compact padding |
| space-3 | 12px | Input padding, small gaps |
| space-4 | 16px | Default card padding, form gaps |
| space-5 | 20px | Section gaps |
| space-6 | 24px | Card padding (comfortable) |
| space-8 | 32px | Section separators |
| space-10 | 40px | Page section spacing |
| space-12 | 48px | Large section spacing |
| space-16 | 64px | Page top/bottom margins |

### Component Spacing

- Form field gap: `space-4` (16px)
- Card internal padding: `space-4` to `space-6`
- Page padding (mobile): `space-4`
- Page padding (desktop): `space-6` to `space-8`
- Between sections: `space-8` to `space-10`
- Inline icon-to-text: `space-2`
- Button internal padding: `space-2` vertical, `space-3` horizontal

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 6px | Badges, tags, small chips |
| radius-md | 8px | Inputs, buttons |
| radius-lg | 12px | Cards, dropdowns |
| radius-xl | 16px | Modals, large cards |
| radius-full | 9999px | Avatars, pills, rounded buttons |

### Rules

- Buttons: `radius-md`
- Cards: `radius-lg`
- Inputs: `radius-md`
- Avatars: `radius-full`
- Modals/sheets: `radius-xl`
- Nested elements use smaller radius than parent

---

## Shadow Elevation

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift (inputs, small cards) |
| shadow-md | `0 4px 6px rgba(0,0,0,0.07)` | Cards, dropdowns |
| shadow-lg | `0 10px 15px rgba(0,0,0,0.1)` | Modals, popovers |
| shadow-xl | `0 20px 25px rgba(0,0,0,0.12)` | Floating panels |

### Rules

- Cards at rest: `shadow-sm`
- Cards on hover: `shadow-md`
- Dropdowns/popovers: `shadow-lg`
- Modals: `shadow-xl`
- No shadows on flat elements inside cards
- Avoid stacking shadows (parent + child both elevated)

---

## Iconography

Library: **Lucide React** (consistent across project)

| Property | Value |
|----------|-------|
| Default size | 16px (`size-4`) |
| Large icon | 20px (`size-5`) |
| Page empty state | 48px (`size-12`) |
| Stroke width | 2 (default Lucide) |
| Color | Inherits text color |

### Rules

- Icons are decorative — always pair with text or aria-label
- Use `size-4` in buttons, menu items, inputs
- Use `size-5` in section headers
- Use `size-12` with muted color in empty states
- Maintain consistent icon choice per concept across app (e.g., `PawPrint` = pets, `ShoppingBag` = orders)

---

## Illustration Style

- Minimal, line-based illustrations for empty states
- Use the warm orange palette (Primary + Background tones)
- Friendly, rounded shapes (matching the pet/animal theme)
- No photographic imagery for placeholder states
- Prefer icon-based empty states over full illustrations for MVP

---

## Motion & Animation

| Property | Value | Usage |
|----------|-------|-------|
| Duration fast | 100ms | Hover color changes, focus rings |
| Duration normal | 200ms | Dropdowns, tooltips, fade-in |
| Duration slow | 300ms | Modals, sheets, page transitions |
| Easing default | `ease-out` | Most transitions |
| Easing spring | `cubic-bezier(0.16, 1, 0.3, 1)` | Playful micro-interactions |

### Rules

- Use `transition-colors` for hover states (100ms)
- Use `transition-all` sparingly — prefer specific properties
- Dropdowns/popovers: fade + scale (200ms)
- Modals: fade + slide-up (300ms)
- Loading spinners: `animate-spin` (infinite)
- No animation on first page paint (prevent layout shift)
- Respect `prefers-reduced-motion`

---

## Responsive Breakpoints

| Token | Width | Usage |
|-------|-------|-------|
| mobile | < 640px | Single column, stacked layout |
| sm | ≥ 640px | Small tablets |
| md | ≥ 768px | Tablets, 2-column grids |
| lg | ≥ 1024px | Desktop, sidebar visible |
| xl | ≥ 1280px | Wide desktop, 3-4 column grids |
| 2xl | ≥ 1536px | Ultra-wide, max-width containers |

### Rules

- Mobile-first: design for mobile, enhance for desktop
- Max content width: `max-w-7xl` (1280px) for main content
- Sidebar collapses on `< lg`
- Navigation switches to bottom bar on mobile
- Form layouts: single column on mobile, 2-col on `≥ md`
- Grid cards: 1 col → 2 col (md) → 3-4 col (lg/xl)

---

## Navigation Patterns

### Customer (Mobile)

Bottom tab bar with 5 items: Home, Explore, Cart, Activity, Account

### Customer (Desktop)

Top header: Logo | Search | Cart | Notifications | Profile dropdown

### Merchant Dashboard

Left sidebar (collapsible) with grouped menu sections

### Admin Dashboard

Left sidebar (collapsible) with grouped menu sections

### Rules

- Active nav item: `Primary` color indicator
- Inactive: `Secondary` color
- Mobile bottom bar: 56px height, icon + label
- Sidebar: 288px width (desktop), full overlay (mobile)
- Breadcrumbs on detail pages (desktop only)

---

## Page Templates

### List Page

```
[Header: Title + Action Button]
[Filters / Search Bar]
[Content Grid / Table]
[Pagination]
```

### Detail Page

```
[Breadcrumb]
[Header: Title + Status + Actions]
[Content Sections / Tabs]
```

### Form Page

```
[Header: Title + Cancel]
[Form Fields in Card]
[Submit Button Bar (sticky on mobile)]
```

### Dashboard Page

```
[Header: Title + Date Range]
[Stat Cards Row]
[Charts / Tables]
```

---

## Card Templates

### Product Card

```
[Image (aspect 1:1)]
[Title - 2 lines max, truncate]
[Price + Discount (if applicable)]
[Rating + Sold count]
[Merchant name]
```

### Service Card

```
[Icon / Image]
[Service name]
[Price range (from Rp...)]
[Duration]
[Branch / Location]
```

### Order/Booking Card

```
[Status badge]
[Merchant + Date]
[Item summary (1-2 lines)]
[Total amount]
[Action button]
```

---

## Form Guidelines

### Layout

- Label above input (not inline)
- Required fields: no asterisk — mark optional fields instead with "(opsional)"
- Group related fields visually (2-col grid on desktop)
- One primary action button per form
- Destructive actions require confirmation

### Validation

- Client-side: validate on blur + on submit (Zod)
- Error message below field, color `Error`, size `Small`
- Invalid input: `aria-invalid` + red border
- Success: no inline success indicator (just submit)

### Input Heights

- Default: 32px (`h-8`)
- Large (auth forms): 36px (`h-9`)
- Textarea: min 80px

### Select / Dropdown

- Full width within form column
- Same height as inputs (32px)
- Consistent border with inputs

---

## Table Guidelines

### Structure

- Header: `Secondary` text, uppercase `XS` size, border-bottom
- Rows: `Surface` background, `Border` separators
- Hover: subtle background change
- Selected: light `Primary` background

### Behavior

- Sortable columns: click header to sort, arrow indicator
- Pagination: bottom right, showing "1-20 of 150"
- Mobile: collapse to card layout or horizontal scroll
- Actions: icon buttons in last column or row dropdown

### Sizing

- Row height: 40-48px
- Cell padding: `space-3` horizontal, `space-2` vertical
- Max width: fill container

---

## Empty State Guidelines

### Structure

```
[Icon (size-12, muted)]
[Title (H3)]
[Description (Body, Secondary color)]
[Action button (optional)]
```

### Rules

- Center vertically and horizontally in content area
- Use relevant Lucide icon (muted at 40% opacity)
- Title: short, specific ("Belum ada hewan terdaftar")
- Description: helpful next step ("Tambahkan hewan untuk booking layanan")
- Action button: primary, leads to creation flow
- Minimum height: 200px to avoid collapsed appearance

---

## Loading State Guidelines

### Page Loading

- Full page: centered spinner (24px, `animate-spin`, Primary color)
- Minimum display: 200ms (avoid flash)

### Section Loading

- Skeleton placeholders matching content shape
- Skeleton color: `Border` (light warm gray)
- Animate: pulse (opacity 0.5 → 1)

### Button Loading

- Replace text with spinner (16px) + optional "Loading..." text
- Button stays same width (prevent layout shift)
- Disabled while loading

### Inline Loading

- Small spinner (16px) next to relevant content
- Used for async actions within a page (e.g., favoriting)

### Rules

- Never show loading state for < 200ms
- Skeleton > spinner for content areas (less jarring)
- Spinner for actions/submissions
- Show error state after timeout (10s default)
- Always provide retry mechanism on error

---

## Logo Guidelines

### Variants

| Variant | Usage |
|---------|-------|
| Primary logo | Full color wordmark, default usage on light backgrounds |
| Horizontal logo | Logomark + wordmark side-by-side, header/nav usage |
| Stacked logo | Logomark above wordmark, splash screens, square placements |
| Icon-only logo | Logomark only, favicons, app icons, small spaces |

### Specifications

- Minimum size (horizontal): 120px width
- Minimum size (icon-only): 24px
- Clear space: minimum 50% of logomark height on all sides
- Primary color: `Primary` (#EA580C) on light backgrounds
- Inverted: white on dark backgrounds

### Incorrect Usage

- Do not stretch or distort proportions
- Do not rotate the logo
- Do not change logo colors outside defined variants
- Do not place on busy or low-contrast backgrounds
- Do not add drop shadows or outlines to the logo
- Do not rearrange logo elements

### Placement

- Header: horizontal logo, left-aligned
- Mobile app bar: icon-only, centered or left
- Splash/loading: stacked logo, centered
- Footer: horizontal logo, reduced opacity or secondary color

---

## Design Tokens

### Semantic Color Tokens

Semantic tokens map purpose to color — components reference semantic tokens, not raw hex values.

```css
:root {
  /* Surfaces */
  --token-bg-page: var(--color-background);
  --token-bg-card: var(--color-surface);
  --token-bg-input: var(--color-surface);
  --token-bg-hover: #FFF1E0;
  --token-bg-active: #FFEDD5;
  --token-bg-disabled: #F1F5F9;

  /* Text */
  --token-text-primary: var(--color-text);
  --token-text-secondary: var(--color-secondary);
  --token-text-disabled: #94A3B8;
  --token-text-inverse: #FFFFFF;
  --token-text-link: var(--color-primary);

  /* Borders */
  --token-border-default: var(--color-border);
  --token-border-strong: #FDBA74;
  --token-border-focus: var(--color-primary);
  --token-border-error: var(--color-error);

  /* Interactive */
  --token-action-primary: var(--color-primary);
  --token-action-primary-hover: var(--color-primary-hover);
  --token-action-destructive: var(--color-error);
  --token-action-disabled: #CBD5E1;
}
```

### Focus Ring Tokens

```css
:root {
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
  --focus-ring-color: rgba(234, 88, 12, 0.35);
  --focus-ring-error: rgba(239, 68, 68, 0.35);
}
```

Applied as: `ring-3 ring-ring/50 ring-offset-2`

### Component Tokens

```css
:root {
  /* Button */
  --btn-height-sm: 28px;
  --btn-height-md: 32px;
  --btn-height-lg: 36px;
  --btn-radius: var(--radius-md);
  --btn-font-size: 14px;
  --btn-font-weight: 500;

  /* Input */
  --input-height: 32px;
  --input-radius: var(--radius-md);
  --input-border: var(--token-border-default);
  --input-focus-border: var(--token-border-focus);

  /* Card */
  --card-radius: var(--radius-lg);
  --card-padding: var(--space-4);
  --card-border: var(--token-border-default);
  --card-shadow: var(--shadow-sm);
}
```

### Dark Theme Preparation

All color values are defined through CSS variables, enabling future dark mode via:

```css
[data-theme="dark"] {
  --color-background: #1C1917;
  --color-surface: #292524;
  --color-text: #F5F5F4;
  --color-secondary: #A8A29E;
  --color-border: #44403C;
  /* Primary stays consistent for brand recognition */
  --color-primary: #EA580C;
  --color-primary-hover: #F97316;
}
```

Components using semantic tokens will automatically adapt. No component API changes required.

---

## Grid System

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile (< 640px) | 4 | 16px | 16px |
| Tablet (640–1023px) | 8 | 24px | 24px |
| Desktop (≥ 1024px) | 12 | 24px | 32px |
| Wide (≥ 1280px) | 12 | 32px | auto (centered) |

### Specifications

- Max container width: 1280px (`max-w-7xl`)
- Content centered beyond max-width
- Gutters use `gap` (CSS Grid) — no margin-based gutters
- Nested grids inherit parent gutter

### Responsive Behavior

- Cards: 1 col (mobile) → 2 col (tablet) → 3–4 col (desktop)
- Forms: 1 col (mobile) → 2 col (tablet+)
- Sidebar + content: stacked (mobile) → 288px + fluid (desktop)
- Dashboard stat cards: scroll horizontal (mobile) → grid row (desktop)

---

## Avatar System

### Sizes

| Token | Size | Usage |
|-------|------|-------|
| avatar-xs | 24px | Inline mentions, compact lists |
| avatar-sm | 32px | Comments, chat messages |
| avatar-md | 40px | Nav user menu, list items |
| avatar-lg | 56px | Profile headers, cards |
| avatar-xl | 80px | Profile page, settings |

### Fallback

When no image is available:

- Display initials (1–2 characters, uppercase)
- Background: deterministic color derived from user name hash
- Fallback colors: `#EA580C`, `#22C55E`, `#3B82F6`, `#F59E0B`, `#8B5CF6`, `#EC4899`
- Text: white, centered, `font-medium`

### Status Indicators

- Online: `Success` dot, bottom-right, 25% of avatar size
- Away: `Warning` dot
- Offline: `Secondary` dot
- Do not use status indicators for pet avatars

### Rules

- Always `radius-full` (circular)
- Border: 2px `Surface` (creates separation on colored backgrounds)
- Pet avatars follow same sizing but may use `radius-lg` for non-circular crops

---

## Badge & Status System

Consistent badge styling for all marketplace entity states:

| Status | Background | Text Color | Usage |
|--------|-----------|------------|-------|
| Draft | `#F1F5F9` | `#64748B` | Unpublished content |
| Pending | `#FEF3C7` | `#92400E` | Awaiting action |
| Waiting Payment | `#FEF3C7` | `#92400E` | Checkout created, payment pending |
| Paid | `#DCFCE7` | `#166534` | Payment confirmed |
| Confirmed | `#DBEAFE` | `#1E40AF` | Booking/order confirmed |
| Processing | `#E0E7FF` | `#3730A3` | Merchant processing |
| Shipping | `#E0F2FE` | `#075985` | In transit |
| Delivered | `#DCFCE7` | `#166534` | Arrived at destination |
| Completed | `#DCFCE7` | `#166534` | Fulfilled, finalized |
| Cancelled | `#F1F5F9` | `#64748B` | Cancelled by user/system |
| Refunded | `#FEF3C7` | `#92400E` | Refund processed |
| Rejected | `#FEE2E2` | `#991B1B` | Denied by merchant/admin |
| Active | `#DCFCE7` | `#166534` | Currently active |
| Inactive | `#F1F5F9` | `#64748B` | Disabled/paused |
| Verified | `#DCFCE7` | `#166534` | Verified by admin |
| Suspended | `#FEE2E2` | `#991B1B` | Account/entity suspended |

### Badge Styling

- Size: `XS` font, `radius-sm`, padding `space-1` horizontal + 2px vertical
- No border — background color provides contrast
- Uppercase not required — use sentence case
- Icons optional (small, `size-3`, before text)

---

## Dashboard Guidelines

### Merchant Dashboard

**KPI Cards:**
- 4 cards in a row (desktop), horizontal scroll (mobile)
- Metric: `H2` size, bold
- Label: `Small`, `Secondary` color
- Trend indicator: up arrow `Success` / down arrow `Error` + percentage
- Period selector: "Hari ini", "7 hari", "30 hari"

**Charts:**
- Follow Data Visualization section for styles
- Default period: last 30 days
- Y-axis: always start at 0
- Tooltips on hover with exact values

**Tables:**
- Follow Table Guidelines
- Default sort: most recent first
- Quick filters above table (status chips)

**Filters:**
- Date range picker
- Status filter (dropdown or chips)
- Branch filter (dropdown)
- Search: debounce 300ms

### Admin Dashboard

**Analytics:**
- Platform-wide KPIs (users, transactions, revenue, merchants)
- Comparison with previous period
- Top-level funnel metrics

**Monitoring:**
- Active users
- Pending verifications count
- Open disputes count
- Failed webhooks/payments (last 24h)

**Audit:**
- Searchable table with actor, action, timestamp
- Filter by entity type, actor, date range
- Detail expansion (before/after values)

---

## Data Visualization

### Chart Colors

Use the following ordered palette for multi-series charts:

```
Series 1: #EA580C (Primary)
Series 2: #3B82F6 (Info)
Series 3: #22C55E (Success)
Series 4: #F59E0B (Warning)
Series 5: #8B5CF6 (Purple)
Series 6: #EC4899 (Pink)
```

### Chart Types

| Type | Usage |
|------|-------|
| Line chart | Trends over time (revenue, orders) |
| Bar chart | Comparisons (products per category, monthly totals) |
| Area chart | Volume over time with emphasis |
| Donut chart | Proportions (order status distribution) |
| Progress bar | Single metric toward goal (target, capacity) |

### Rules

- Library: Recharts (already in project)
- Always include axis labels
- Y-axis starts at 0 (no truncation)
- Responsive: charts resize with container
- Tooltips: show exact value + label on hover
- Legend: below chart, horizontal, `Small` text
- Empty state: "Belum ada data" message, no blank chart
- Animate on first render only (300ms)
- Grid lines: subtle `Border` color, horizontal only

---

## Notification System

### Types

| Type | Component | Duration | Usage |
|------|-----------|----------|-------|
| Toast | Floating, top-right | Auto-dismiss 5s | Quick feedback (saved, deleted, copied) |
| Alert | Inline, full-width | Persistent until dismissed | Important page-level notices |
| Banner | Top of page, full-width | Persistent | System announcements, maintenance |
| Snackbar | Bottom-center, floating | Auto-dismiss 5s | Mobile-friendly feedback |
| Inline message | Below field/section | Persistent | Contextual warnings, tips |

### Variants

| Variant | Icon | Border/BG | Usage |
|---------|------|-----------|-------|
| Success | `CircleCheck` | `Success` 10% bg, `Success` left border | Action completed |
| Warning | `TriangleAlert` | `Warning` 10% bg, `Warning` left border | Non-blocking concern |
| Error | `OctagonX` | `Error` 10% bg, `Error` left border | Failed action, requires attention |
| Info | `Info` | `Info` 10% bg, `Info` left border | Neutral information |

### Rules

- Toast: max 3 visible simultaneously, stack vertically
- Toast with actions: "Undo" link, extends duration to 8s
- Alert: dismissible via X button (except error requiring action)
- Banner: not dismissible for system-critical messages
- Use Sonner for toasts (already configured)
- Error toasts for API failures; inline messages for validation

---

## Modal & Dialog Guidelines

### Types

| Type | Usage | Size |
|------|-------|------|
| Confirmation | "Apakah Anda yakin?" before non-trivial actions | Small (400px) |
| Delete confirmation | Destructive action with consequences | Small (400px) |
| Destructive action | Irreversible (account deletion, data loss) | Small, red accent |
| Success dialog | Completion of important flow (payment, booking) | Medium (500px) |
| Bottom sheet | Mobile-friendly selection, filters | Full-width, variable height |
| Drawer | Side panel for detail views, forms | 400–500px width |

### Structure

```
[Title (H3)]
[Description / Content]
[Action buttons: right-aligned, primary + secondary]
```

### Rules

- Backdrop: `rgba(0,0,0,0.5)`, click outside to dismiss (except destructive)
- Destructive modals: require explicit confirm, cannot dismiss by clicking outside
- Delete confirmation: repeat entity name, require typing name for critical items
- Buttons: Cancel (ghost/outline) left, Confirm (primary/destructive) right
- Animation: fade-in + scale (200ms)
- Focus trap: first focusable element receives focus
- Escape key closes (except destructive)
- Mobile: prefer bottom sheet over centered modal
- Max height: 80vh, scroll content area (not entire modal)

---

## Accessibility

### WCAG Compliance

Target: WCAG 2.1 Level AA

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | Text: minimum 4.5:1, large text: 3:1 |
| Focus visible | All interactive elements have visible focus ring |
| Touch targets | Minimum 44×44px on mobile |
| Alt text | All meaningful images have descriptive alt |
| Form labels | Every input has associated label (visible or sr-only) |
| Error identification | Errors identified by text, not color alone |
| Headings | Logical heading hierarchy (no skipping levels) |

### Keyboard Navigation

- Tab: moves focus forward through interactive elements
- Shift+Tab: moves focus backward
- Enter/Space: activates buttons and links
- Escape: closes modals, dropdowns, popovers
- Arrow keys: navigate within menus, tabs, radio groups
- Home/End: first/last item in lists

### Screen Reader Support

- Use semantic HTML (`button`, `nav`, `main`, `article`, `section`)
- ARIA labels for icon-only buttons
- `aria-live` regions for dynamic content (toasts, status updates)
- `aria-expanded` for collapsible sections
- `aria-current="page"` for active nav items
- Announce route changes via live region

### Focus Order

- Logical document order matches visual order
- No focus trap outside modals
- Skip-to-content link as first focusable element
- Modal focus trap: tab cycles within modal only

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Content & Copywriting

### Tone

- **Friendly**: use "Anda" (formal but warm), casual vocabulary
- **Helpful**: tell users what to do next, not just what went wrong
- **Professional**: no slang, no excessive punctuation
- **Concise**: shortest sentence that preserves meaning

### Button Labels

- Use verbs: "Simpan", "Kirim", "Hapus", "Batal"
- Primary action: specific ("Daftar Hewan" not "Submit")
- Destructive: explicit ("Hapus Akun" not "Lanjutkan")

### Error Messages

- Say what happened + what to do: "Email sudah terdaftar. Gunakan email lain atau masuk."
- Never blame the user
- Never show raw technical errors to users

### Success Messages

- Confirm what was done: "Hewan berhasil didaftarkan"
- Brief — no "Selamat!" or excessive celebration

### Empty States

- Title: what's missing ("Belum ada pesanan")
- Description: what to do ("Pesanan Anda akan muncul di sini setelah checkout")
- No apologetic language ("Maaf" unnecessary)

### Confirmation Dialogs

- Title: action-oriented question ("Hapus hewan ini?")
- Description: consequence ("Data hewan akan dihapus permanen")
- Buttons: "Batal" + "Hapus" (match action)

---

## Responsive Layout Patterns

### Mobile Navigation

- Bottom tab bar (56px height): Home, Explore, Cart, Activity, Account
- Hamburger menu NOT used — bottom tabs are primary
- In-page back button for nested views
- Pull-to-refresh on list pages

### Tablet Navigation

- Bottom tab bar preserved (or top header depending on orientation)
- 2-column layouts where applicable
- Side sheet for filters (not full-page)

### Desktop Navigation

- Top header with search, cart, notifications, profile
- No bottom bar
- Sidebar for merchant/admin dashboards
- Breadcrumbs for navigation depth

### Common Page Layouts

| Page | Mobile | Desktop |
|------|--------|---------|
| Authentication | Centered card, full-width | Centered card, max-w-md |
| Dashboard | Stacked sections, scroll | Grid layout, sidebar |
| Marketplace | Single-column cards | 3-4 column grid |
| Detail | Stacked sections | 2-column (content + sidebar) |
| Checkout | Stacked steps | 2-column (cart + summary) |
| Profile | Stacked cards | Single column, max-w-2xl |
| Settings | Stacked sections | Sidebar nav + content |

---

## File Upload Guidelines

### Image Specifications

| Context | Aspect Ratio | Max Size | Formats |
|---------|-------------|----------|---------|
| Product image | 1:1 (square) | 5MB | JPEG, PNG, WebP |
| Profile photo | 1:1 (square) | 2MB | JPEG, PNG, WebP |
| Pet photo | 1:1 (square) | 2MB | JPEG, PNG, WebP |
| Merchant banner | 16:9 | 5MB | JPEG, PNG, WebP |
| Merchant logo | 1:1 (square) | 2MB | JPEG, PNG, WebP |
| Document scan | Any | 10MB | JPEG, PNG, PDF |
| Chat attachment | Any | 10MB | JPEG, PNG, WebP, PDF |

### Upload UX

- Drag-and-drop zone with clear visual affordance
- Click-to-browse fallback
- Show file preview before upload (client-side)
- Progress indicator during upload
- Crop tool for avatar/profile photos (square crop)
- Error: show specific reason ("File terlalu besar. Maksimum 5MB.")
- Multiple file upload where applicable (product images)
- Reorder via drag-and-drop (product image gallery)

### Rules

- Validate file type and size on client before upload
- Server re-validates (never trust client)
- Generate thumbnails server-side
- Store in object storage (S3-compatible), metadata in PostgreSQL
- Display optimized/resized versions, not originals

---

## Search & Filter Patterns

### Search Behavior

- Input with search icon, placeholder: "Cari produk, layanan, atau toko..."
- Debounce: 300ms after user stops typing
- Minimum query length: 2 characters
- Recent searches: show last 5 on focus (stored locally)
- Clear button: appears when input has value
- Loading: inline spinner replacing search icon

### Sorting

- Dropdown or segmented control
- Common sorts: "Terbaru", "Harga terendah", "Harga tertinggi", "Rating tertinggi", "Terlaris"
- Active sort visually indicated
- Default: relevance (when searching) or newest (when browsing)

### Filter Chips

- Horizontal scrollable row below search
- Active filters: `Primary` background, white text
- Inactive: `Surface` background, `Border` outline
- "Hapus semua" link when any filter active
- Common filters: category, price range, rating, location

### Pagination

- Default: 20 items per page
- Desktop: numbered pagination (1, 2, 3... 10, Next)
- Show: "Menampilkan 1-20 dari 150 produk"
- Keep scroll position on filter/sort change

### Infinite Scroll

- Use for mobile marketplace browsing (products, services)
- Load indicator: skeleton cards at bottom
- "Muat lebih banyak" button as fallback if scroll detection fails
- End indicator: "Tidak ada lagi produk" when all loaded
- Do NOT use infinite scroll for tables or admin lists (use pagination)

---

## Theme Preparation

The design system is built for future dark mode support without component API changes.

### Architecture

1. All colors defined as CSS variables (already done)
2. Components reference semantic tokens, not raw hex
3. Theme switching via `data-theme` attribute on `<html>`
4. Use `next-themes` (already installed) for theme management

### Implementation Checklist (for future dark mode)

- [ ] Define dark mode color values for all tokens
- [ ] Add `dark:` variant overrides in Tailwind config
- [ ] Test all badge/status colors for contrast in dark mode
- [ ] Adjust shadow values (lighter/subtler in dark mode)
- [ ] Test charts/data viz colors for dark backgrounds
- [ ] Add theme toggle in settings page
- [ ] Persist preference in localStorage
- [ ] Respect `prefers-color-scheme` as default

### Rules

- Never use hardcoded hex in components — always reference tokens/variables
- Never use `bg-white` — use `bg-surface` or equivalent token
- Never use `text-black` — use `text-foreground` or equivalent token
- Borders: always use token, never hardcoded gray
- Images/illustrations: provide dark variants where needed

---

# Core Reusable Components

Every component below is the single canonical implementation. It MUST NOT be redesigned differently across pages. All screens reuse these exact specifications.

---

## App Header

Standard header for authenticated customer pages.

**Purpose:** Persistent top navigation for customer-facing pages.
**Used in:** All `(customer)` route group pages.

| Property | Value |
|----------|-------|
| Height | 56px (mobile), 64px (desktop) |
| Background | `Surface` |
| Border | 1px bottom, `Border` |
| Position | Sticky, top: 0, z-50 |
| Padding | `space-4` horizontal |

**Layout (mobile):**
```
[Back Button OR Logo] [Page Title (center)] [Action Icons]
```

**Layout (desktop):**
```
[Logo] [Search Bar (expanded)] [Cart] [Notifications] [Profile Dropdown]
```

**Specifications:**
- Logo: icon-only on mobile (24px), horizontal on desktop (120px)
- Page title: `H4`, centered on mobile, hidden on desktop
- Search button: `size-5` icon, shown on mobile (opens search overlay)
- Notification button: `size-5` icon, badge count (Error bg, white text, `XS`)
- Profile button: `avatar-sm` (32px)
- Back button: shown when navigating deeper than root level on mobile

**Show logic:**
- Logo: home/root pages
- Page Title: sub-pages on mobile
- Search: always (icon on mobile, expanded bar on desktop)
- Back Button: non-root pages on mobile (replaces logo)


---

## Bottom Navigation

**Purpose:** Primary navigation for customer mobile experience.
**Used in:** All customer pages on mobile (< lg breakpoint).

| Property | Value |
|----------|-------|
| Height | 56px |
| Background | `Surface` |
| Border | 1px top, `Border` |
| Position | Fixed, bottom: 0, z-50 |
| Max items | 5 |

**Tabs:** Home, Explore, Cart, Activity, Account

| State | Icon Color | Label Color | Icon Size | Label Size |
|-------|-----------|-------------|-----------|------------|
| Active | `Primary` | `Primary` | 24px (`size-6`) | `XS` (11px) |
| Inactive | `Secondary` | `Secondary` | 24px (`size-6`) | `XS` (11px) |

**Badge:** Cart count — `Error` bg, white text, `XS`, positioned top-right of icon.
**Animation:** Icon scale 1.1 on tap (100ms), color transition (100ms).
**Hidden:** On desktop (≥ lg breakpoint).

---

## Sidebar

### Merchant Dashboard Sidebar

| Property | Value |
|----------|-------|
| Width expanded | 288px |
| Width collapsed | 64px |
| Background | `Surface` |
| Border | 1px right, `Border` |
| Collapse | `< lg` auto-collapses, toggle button |

**Menu items:**
- Icon: `size-5`, `Secondary` (inactive), `Primary` (active)
- Label: `Body` size, `Text` (active), `Secondary` (inactive)
- Active item: `Primary` 10% bg, `Primary` text, left 3px `Primary` border
- Hover: `Background` bg
- Nested menu: indented `space-6`, smaller icon `size-4`
- Group headers: `XS`, uppercase, `Secondary`, `space-8` top margin

### Admin Dashboard Sidebar

Same specifications as Merchant Dashboard. Different menu items.


---

## Search Bar

**Purpose:** Single reusable search input with consistent behavior.
**Used in:** Header, marketplace browse, admin lists.

| Property | Value |
|----------|-------|
| Height | 36px (`h-9`) |
| Radius | `radius-full` (pill shape) |
| Background | `Background` |
| Border | 1px `Border`, focus: `Primary` |
| Icon | Search (`size-4`), left, `Secondary` |
| Placeholder | "Cari produk, layanan, atau toko..." |
| Clear button | X icon, appears when value present |
| Debounce | 300ms |
| Min query | 2 characters |

---

## Product Card

**Purpose:** Display a product in any listing context.
**Used in:** Home, search results, category, wishlist, recommendations, merchant store.
**Never redesign.** Always reuse this exact card.

| Property | Value |
|----------|-------|
| Radius | `radius-lg` |
| Border | 1px `Border` |
| Background | `Surface` |
| Shadow | `shadow-sm`, hover: `shadow-md` |
| Padding | 0 (image flush) + `space-3` body |
| Width | Fluid (grid-determined) |

**Layout:**
```
[Image (1:1 aspect, radius-lg top corners)]
[Title — Body, semibold, max 2 lines, truncate]
[Price — H4, Primary color. If discount: original struck-through in Secondary]
[Rating (★ value) + Sold count — Small, Secondary]
[Merchant name — XS, Secondary]
```

**States:** Default, hover (shadow-md, slight y-translate), loading (skeleton), out-of-stock (image overlay "Habis", muted).

---

## Service Card

**Purpose:** Display a bookable service.
**Used in:** Service browse, merchant store, search, recommendations.

| Property | Value |
|----------|-------|
| Radius | `radius-lg` |
| Border | 1px `Border` |
| Background | `Surface` |
| Padding | `space-4` |

**Layout:**
```
[Service icon or image (40px, radius-md)]
[Service name — Body, semibold]
[Price range — Small, "Mulai dari Rp xxx"]
[Duration — Small, Secondary, "~60 menit"]
[Branch name — XS, Secondary]
```


---

## Merchant Card

**Purpose:** Display merchant/petshop summary.
**Used in:** Nearby merchants, search, favorites.

**Layout:**
```
[Logo (avatar-md, radius-full)] [Name — Body, semibold]
[Location — Small, Secondary]
[Rating ★ + Review count — Small]
[Verified badge (if applicable)]
```

---

## Branch Card

**Purpose:** Display a merchant branch.
**Used in:** Merchant detail, branch selection during booking.

**Layout:**
```
[Branch name — Body, semibold]
[Address — Small, Secondary, max 2 lines]
[Distance (if location available) — Small, Primary]
[Hours status: "Buka" (Success) / "Tutup" (Error)]
```

---

## Booking Card

**Purpose:** Display a service booking in lists.
**Used in:** Customer bookings, merchant bookings, activity feed.

**Layout:**
```
[Status badge (top-right)]
[Service name — Body, semibold]
[Pet name + Branch — Small, Secondary]
[Date + Time — Small]
[Price — Body, semibold]
[Action button (if applicable)]
```

---

## Order Card

**Purpose:** Display a product order in lists.
**Used in:** Customer orders, merchant orders, activity feed.

**Layout:**
```
[Status badge (top-right)]
[Merchant name — Small, Secondary]
[Item summary — Body (e.g., "Royal Canin 2kg + 1 lainnya")]
[Order date — Small, Secondary]
[Total — Body, semibold]
[Action button (if applicable)]
```

---

## Pet Card

**Purpose:** Display a pet profile.
**Used in:** Pet list, pet selection during booking.

**Layout:**
```
[Pet photo (avatar-lg, radius-full) OR species icon fallback]
[Name — Body, semibold]
[Species + Breed — Small, Secondary]
[Age — Small, Secondary]
```

---

## Vaccination Card

**Purpose:** Display a vaccination history record.
**Used in:** Pet detail vaccination timeline.

**Layout:**
```
[Vaccine name — Body, semibold]
[Date administered — Small, Secondary]
[Next due date — Small, Warning color if upcoming]
[Vet name + Clinic — XS, Secondary]
```


---

## Cart Item

**Purpose:** Display a single item within the cart.
**Used in:** Cart page, checkout summary.

**Layout:**
```
[Product image (64px, 1:1, radius-md)]
[Product name — Body, max 2 lines]
[Variant info — Small, Secondary]
[Merchant name — XS, Secondary]
[Quantity control (- [n] +)]
[Price — Body, semibold, right-aligned]
[Remove button (Trash icon, ghost)]
```

For service items: replace quantity with date/time + pet name.

---

## Checkout Summary Card

**Purpose:** Price breakdown during checkout.
**Used in:** Checkout page (right column desktop, bottom sheet mobile).

| Property | Value |
|----------|-------|
| Background | `Surface` |
| Border | 1px `Border` |
| Radius | `radius-lg` |
| Padding | `space-4` |
| Position | Sticky (desktop), bottom sheet (mobile) |

**Layout:**
```
[Subtotal produk — row: label + value]
[Subtotal layanan — row]
[Ongkir — row]
[Diskon — row, Success color, negative]
[Separator line]
[Total — row, H3 size, semibold]
[CTA Button: "Bayar" — primary, full-width]
```

---

## User Profile Card

**Purpose:** Display user info in settings/profile.
**Used in:** Profile page, account settings header.

**Layout:**
```
[Avatar (avatar-xl)] [Name — H3] [Email — Small, Secondary]
[Role badge] [Status badge]
```

---

## Address Card

**Purpose:** Display a delivery address.
**Used in:** Address list, checkout address selection.

**Layout:**
```
[Label + Default badge (if default)] — Body, semibold
[Recipient name + phone — Small]
[Full address — Small, Secondary, max 3 lines]
[Action icons: Edit, Delete, Set Default]
```

---

## Review Card

**Purpose:** Display a user review.
**Used in:** Product detail, service detail, merchant reviews.

**Layout:**
```
[User avatar (avatar-sm) + Name + Date — Small]
[Star rating (filled Primary, empty Secondary)]
[Review text — Body, max 4 lines with "Selengkapnya"]
[Review images (thumbnails, 48px, radius-sm)]
[Merchant reply (if exists): indented, Background bg]
```

---

## Chat Bubble

**Purpose:** Display chat messages.
**Used in:** Chat conversation view.

### Customer message (right-aligned)
- Background: `Primary` 10%
- Radius: `radius-lg` (top-left, top-right, bottom-left), `radius-sm` (bottom-right)
- Text: `Text` color
- Timestamp: `XS`, `Secondary`, below bubble

### Merchant message (left-aligned)
- Background: `Surface`, 1px `Border`
- Radius: `radius-lg` (top-left, top-right, bottom-right), `radius-sm` (bottom-left)
- Text: `Text` color

### System message (centered)
- Background: `Background`
- Radius: `radius-full`
- Text: `Small`, `Secondary`, centered
- Usage: "Pesanan dibuat", "Booking dikonfirmasi"


---

## Notification Card

**Purpose:** Display a notification item.
**Used in:** Notification list/center.

**Layout:**
```
[Icon (relevant to type, size-5)] [Title — Body, semibold if unread]
[Description — Small, Secondary, max 2 lines]
[Timestamp — XS, Secondary]
[Unread indicator: 8px Primary dot, left]
```

---

## Dashboard KPI Card

**Purpose:** Display a single key metric.
**Used in:** Merchant dashboard, admin dashboard.

| Property | Value |
|----------|-------|
| Background | `Surface` |
| Border | 1px `Border` |
| Radius | `radius-lg` |
| Padding | `space-4` |
| Min width | 200px |

**Layout:**
```
[Label — Small, Secondary]
[Value — H2, semibold]
[Trend: ↑ 12% (Success) or ↓ 5% (Error) — Small]
```

---

## Statistics Card

**Purpose:** Display a metric with mini chart or progress.
**Used in:** Dashboard, analytics sections.

**Layout:**
```
[Label + info tooltip icon]
[Value — H2]
[Mini sparkline or progress bar]
[Comparison text — XS, Secondary]
```

---

## Empty State

**One reusable pattern for all empty states.**

| Property | Value |
|----------|-------|
| Min height | 200px |
| Alignment | Center (both axes) |
| Max width | 320px (text block) |

**Layout:**
```
[Lucide icon (size-12, Secondary at 40% opacity)]
[Title — H3, space-4 top]
[Description — Body, Secondary, space-2 top, text-center]
[CTA Button — Primary, space-4 top (optional)]
```

---

## Skeleton Loading

### List Skeleton
- Repeat 3-5 skeleton rows
- Each row: 48px circle + 2 text blocks (60% + 40% width)
- Pulse animation

### Card Skeleton
- Rectangle (1:1 aspect) for image
- 3 text blocks below (100%, 70%, 50% width)
- Pulse animation
- Match actual card radius and padding

### Detail Skeleton
- Large rectangle for header/image
- Multiple text blocks of varying width
- Separated sections matching actual layout

### Table Skeleton
- Header row (solid `Border` bg)
- 5 data rows with varying-width text blocks
- Consistent row height (44px)

---

## Table

Canonical table implementation.

| Property | Value |
|----------|-------|
| Header bg | `Background` |
| Header text | `Secondary`, `XS`, uppercase, `font-medium` |
| Row height | 44px |
| Row bg | `Surface` |
| Row hover | `Background` |
| Row selected | `Primary` 5% bg |
| Border | 1px bottom `Border` per row |
| Cell padding | `space-3` horizontal, `space-2` vertical |

**Pagination:** Below table, right-aligned. "1-20 dari 150" + prev/next buttons.
**Empty state:** Use canonical Empty State component inside table body.
**Responsive:** Collapse to card list on mobile, or horizontal scroll with sticky first column.


---

## Form Layout

**One reusable form pattern across all forms.**

| Property | Value |
|----------|-------|
| Field gap | `space-4` vertical |
| Grid | 1 col (mobile), 2 col (≥ md) |
| Label | Above input, `Small`, `font-medium`, `space-1.5` bottom margin |
| Helper text | Below input, `XS`, `Secondary` |
| Error text | Below input, `XS`, `Error` color |
| Required indicator | None — mark optional with "(opsional)" |
| Section separator | `space-8` between groups |
| Submit button | Full-width (mobile), right-aligned (desktop) |

**Validation display:**
- Error: red border + error text below
- `aria-invalid="true"` on input
- Error icon optional (inside input, right side)
- Validate on blur + on submit

---

## Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `Primary` | white | none | Main CTA |
| Secondary | `Background` | `Text` | 1px `Border` | Secondary actions |
| Outline | transparent | `Primary` | 1px `Primary` | Tertiary, less emphasis |
| Ghost | transparent | `Text` | none | Inline actions, nav |
| Danger | `Error` 10% | `Error` | none | Destructive actions |
| Icon Button | transparent | `Secondary` | none | Icon-only actions |
| FAB | `Primary` | white | none | Floating add action (mobile) |
| Loading | Same as variant | Spinner + optional text | same | In-progress |

**Sizes:** sm (28px), md (32px), lg (36px)
**Radius:** `radius-md`
**Icon:** `size-4`, left or right of label
**Disabled:** 50% opacity, `cursor-not-allowed`
**Loading:** spinner replaces icon, text optional, same width maintained

---

## Chips

**Purpose:** Selectable filter options.

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | `Surface` | `Text` | 1px `Border` |
| Selected | `Primary` | white | none |
| Disabled | `Background` | `Secondary` | 1px `Border` |

Size: `Small` text, `radius-full`, padding `space-1` vertical + `space-3` horizontal.
Removable: X icon (`size-3`) on right for active filters.

---

## Badges

See **Badge & Status System** section above for full color mapping. Reuse that system universally.

Size: `XS` text, `radius-sm`, padding 2px vertical + `space-1` horizontal.

---

## Tags

**Purpose:** Categorization labels (non-interactive).

- Background: `Background`
- Text: `Secondary`
- Radius: `radius-sm`
- Size: `XS`
- Not clickable (use Chips for interactive)

---

## Avatars

See **Avatar System** section above. Reuse universally.

---

## Dialog

See **Modal & Dialog Guidelines** section above. One implementation for all confirmation flows.

---

## Bottom Sheet

**Purpose:** Mobile-friendly overlays for selections and forms.

| Property | Value |
|----------|-------|
| Background | `Surface` |
| Radius | `radius-xl` top-left + top-right |
| Max height | 85vh |
| Handle | 32px × 4px, `Border` color, centered, `radius-full` |
| Backdrop | `rgba(0,0,0,0.5)` |
| Animation | Slide up, 300ms |

Dismiss: drag down, tap backdrop, or explicit close button.

---

## Drawer

**Purpose:** Side panel for detailed views (desktop).

| Property | Value |
|----------|-------|
| Width | 400–500px |
| Background | `Surface` |
| Position | Right, full height |
| Shadow | `shadow-xl` |
| Animation | Slide from right, 300ms |
| Close | X button top-right + Escape key |

---

## Toast

See **Notification System** section. Use Sonner (already configured).
Position: top-right (desktop), top-center (mobile). Max 3 visible.

---

## Alert

Inline, full-width alert. See Notification System for variants.
- Left border: 3px, variant color
- Icon + title + description
- Optional dismiss X button

---

## Pagination

| Property | Value |
|----------|-------|
| Button size | 32px square |
| Radius | `radius-md` |
| Active | `Primary` bg, white text |
| Inactive | `Surface` bg, `Text` |
| Disabled | 50% opacity |
| Layout | Prev + page numbers + Next |
| Info text | "1-20 dari 150" left-aligned, `Small`, `Secondary` |


---

## Breadcrumb

| Property | Value |
|----------|-------|
| Separator | `/` or `ChevronRight` icon (`size-3`) |
| Text | `Small`, `Secondary` (inactive), `Text` (current) |
| Current item | Not linked, `font-medium` |
| Truncation | Show first + last 2 items, ellipsis in middle for deep paths |
| Visibility | Desktop only (hidden on mobile, use back button instead) |

---

## Tabs

| Property | Value |
|----------|-------|
| Active tab | `Primary` color, 2px bottom border `Primary` |
| Inactive tab | `Secondary` color, no border |
| Height | 40px |
| Text | `Body` size, `font-medium` |
| Animation | Border slides (200ms) |
| Scrollable | Horizontal scroll on mobile if > 4 tabs |

---

## Accordion

| Property | Value |
|----------|-------|
| Header | `Body`, `font-medium`, full-width clickable |
| Chevron | Right-aligned, rotates 180° on open (200ms) |
| Border | 1px bottom `Border` between items |
| Content padding | `space-4` |
| Animation | Height expand/collapse (200ms) |

---

## Timeline

**Purpose:** Display chronological events (order/booking history).

| Property | Value |
|----------|-------|
| Line | 2px, `Border`, vertical |
| Dot | 8px, `Primary` (current), `Border` (past) |
| Item spacing | `space-4` between items |
| Text | Title: `Body`. Timestamp: `Small`, `Secondary` |

---

## Stepper

**Purpose:** Multi-step processes (checkout, onboarding).

| Property | Value |
|----------|-------|
| Step circle | 32px, numbered |
| Active | `Primary` bg, white text |
| Completed | `Success` bg, check icon, white |
| Upcoming | `Border` bg, `Secondary` text |
| Connector line | 2px, `Success` (completed), `Border` (upcoming) |
| Label | `Small`, below circle |

---

## Calendar

**Purpose:** Date selection for bookings.

| Property | Value |
|----------|-------|
| Cell size | 40px square |
| Today | `Primary` outline ring |
| Selected | `Primary` bg, white text |
| Range (hotel) | `Primary` 10% bg between start/end |
| Disabled | 50% opacity, not clickable |
| Header | Month/year, prev/next arrows |

---

## Date Picker

Input that opens Calendar on focus/click. Displays value as `DD MMM YYYY`.
Mobile: native date picker preferred. Desktop: custom calendar dropdown.

---

## Time Picker

Dropdown/select with 30-minute intervals. Format: `HH:mm` (24h) displayed as `HH.mm WIB`.
For booking slots: show only available times (disabled unavailable).

---

## Rating Component

| Context | Size | Interactive |
|---------|------|-------------|
| Display (card) | 12px stars | No (read-only) |
| Display (detail) | 16px stars | No |
| Input (review form) | 24px stars | Yes (clickable) |

- Filled: `Warning` (#F59E0B)
- Empty: `Border`
- Half-star: supported for display (not input)

---

## Price Component

Standard price formatting across all contexts:

**Normal price:**
```
Rp 150.000
```
- `H4` or `Body` depending on context, `font-semibold`

**Discounted price:**
```
Rp 120.000  (Primary color, semibold)
Rp 150.000  (Secondary color, line-through, Small)
Hemat 20%   (Success color, XS)
```

**Price range (services):**
```
Mulai dari Rp 75.000
```
- `Small`, `Secondary`

**Rules:**
- Always use dot as thousands separator: `Rp 1.250.000`
- No decimal places for IDR
- "Rp" prefix, space before number
- Discount percentage: rounded to integer


---

## Status System

Universal status badge design. One system for all entities.

| Status | Background | Text | Icon | Usage |
|--------|-----------|------|------|-------|
| Draft | `#F1F5F9` | `#64748B` | `FileEdit` | Unpublished content |
| Pending | `#FEF3C7` | `#92400E` | `Clock` | Awaiting action |
| Submitted | `#FEF3C7` | `#92400E` | `Send` | Sent for review |
| Waiting Payment | `#FEF3C7` | `#92400E` | `CreditCard` | Payment pending |
| Paid | `#DCFCE7` | `#166534` | `CircleCheck` | Payment confirmed |
| Processing | `#E0E7FF` | `#3730A3` | `Loader` | Being prepared |
| Confirmed | `#DBEAFE` | `#1E40AF` | `CheckCircle` | Accepted/confirmed |
| Scheduled | `#DBEAFE` | `#1E40AF` | `Calendar` | Future appointment |
| Checked In | `#DBEAFE` | `#1E40AF` | `LogIn` | Arrived at location |
| In Progress | `#E0E7FF` | `#3730A3` | `Play` | Currently executing |
| Completed | `#DCFCE7` | `#166534` | `CircleCheck` | Fulfilled/done |
| Cancelled | `#F1F5F9` | `#64748B` | `XCircle` | Cancelled |
| Rejected | `#FEE2E2` | `#991B1B` | `XOctagon` | Denied |
| Refunded | `#FEF3C7` | `#92400E` | `RotateCcw` | Money returned |
| Expired | `#F1F5F9` | `#64748B` | `Timer` | Past deadline |
| Verified | `#DCFCE7` | `#166534` | `ShieldCheck` | Verified by admin |
| Suspended | `#FEE2E2` | `#991B1B` | `Ban` | Temporarily blocked |
| Inactive | `#F1F5F9` | `#64748B` | `MinusCircle` | Disabled |
| Active | `#DCFCE7` | `#166534` | `CircleDot` | Currently active |
| Published | `#DCFCE7` | `#166534` | `Globe` | Live/public |
| Archived | `#F1F5F9` | `#64748B` | `Archive` | Historical |

**Badge spec:** `XS` text, `radius-sm`, padding 2px vertical + `space-1` horizontal, optional icon `size-3` left.

---

## Component Reuse Rules

These rules are mandatory for all AI agents and designers:

1. **Never redesign** a component that already exists in this design system.
2. **Always check** this document before creating a new component pattern.
3. **Product Card** is the same everywhere — home, search, category, wishlist, merchant.
4. **Empty State** uses the one canonical pattern — never invent a new layout.
5. **Buttons** follow the defined variants — never create a new button style.
6. **Status badges** use the universal Status System — never invent new badge colors.
7. **Form layouts** follow the one Form Layout spec — never change label positioning or spacing.
8. **Navigation** follows the defined patterns — never change header height, bottom bar, or sidebar width.
9. If a new component type is genuinely needed, **add it to this document first** before implementing.
10. Deviation from this system is a bug, not a design choice.

---

## Design Consistency Rules

Every page must feel like it belongs to the same application. Enforce:

| Area | Rule |
|------|------|
| Typography | Use only defined type scale. No custom font sizes. |
| Spacing | Use only `space-*` tokens. No arbitrary pixel values. |
| Header | Same App Header component on all customer pages. |
| Navigation | Same bottom bar (mobile) / header (desktop) everywhere. |
| Cards | Same card radius, border, shadow across all card types. |
| Buttons | Same height, radius, font across all pages. |
| Icons | Same library (Lucide), same sizes, same stroke width. |
| Colors | Only use defined palette tokens. No one-off hex values. |
| Animation | Same durations and easings everywhere. No custom timings. |
| Responsive | Same breakpoints and layout rules on every page. |

**The test:** If you screenshot two different pages and place them side-by-side, they must look like they were designed by the same team in the same session.
