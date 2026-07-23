# MVP Page Catalog

## Customer/Public
`/`, `/search`, `/products`, `/products/[id]`, `/services`, `/services/[id]`, `/merchants`, `/merchants/[id]`, `/promotions`, auth pages, `/cart`, `/checkout`, `/checkout/[id]`, payment/result, account/profile/addresses/security/sessions/notifications, `/pets`, pet detail/edit/vaccinations, `/orders`, order detail, `/bookings`, booking detail, `/refunds`, favorites, messages, reviews and disputes.

## Merchant
`/merchant/dashboard`, onboarding/profile/verification, branches/hours, staff/veterinarians, products/variants, inventory/movements, services/pricing/branches/staff/schedules, orders, bookings, reviews, messages, promotions/vouchers, finance/ledger/settlements/bank-accounts/withdrawals.

## Admin
`/admin/dashboard`, users, merchants/applications, veterinarians, categories, brands, products, services, checkouts, orders, bookings, payments, refunds, shipping/shipments, commission rules, settlements, withdrawals, vouchers, campaigns, banners, reviews, disputes, roles/permissions, configuration, webhooks and audit logs.

## UI rules
Every data page handles loading, empty, error, retry and permission/not-found states. Every form handles client/server validation, pending state and double-submit protection.

Checkout remains visually unified while clearly grouping merchant/branch product fulfillment and showing service pet/branch/date/time/staff/policy details.

Customer experience must be mobile-first. Merchant/admin dashboards target desktop/laptop first but remain usable at smaller widths.
