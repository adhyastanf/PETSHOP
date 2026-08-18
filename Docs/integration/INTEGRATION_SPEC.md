# Oyen — Integration Specification

Provider choices may change. Business code must depend on provider-neutral interfaces.

## Payment Gateway
Interface responsibilities:
- create payment attempt,
- query/reconcile payment if supported,
- verify webhook signature,
- parse provider event,
- request refund,
- map provider status to canonical internal status.

Store external payment ID/event ID. Webhooks are idempotent. Browser redirects are not proof of payment.

## Shipping Aggregator
Responsibilities:
- get shipping rates,
- create shipment/order with provider,
- obtain tracking number,
- query tracking where supported,
- verify/process webhook,
- map courier/provider statuses to canonical shipment statuses.

Shipping quote stores provider code, courier/service code, amount, ETA, expiry and external quote identity where supplied.

## Object Storage
Provider-neutral operations:
- generate/upload object,
- read/generate authorized URL,
- delete/archive according to policy,
- metadata validation.

Validate MIME type, size and allowed extensions/content. Private files must not become public by guessing an object URL.

## OAuth
Google/Apple login adapters verify provider tokens/authorization flow and map provider identity to `user_oauth_accounts`. Never trust client-supplied provider user IDs without provider verification.

## Email / Push
Notification domain creates logical notifications; delivery adapters send channel-specific messages. Delivery attempts record provider status/error without exposing secrets.

## Webhook Endpoint Principles
Typical routes:
```text
POST /api/v1/webhooks/payments/{provider}
POST /api/v1/webhooks/shipping/{provider}
```

Processing:
1. Receive raw request.
2. Verify signature/authenticity.
3. Derive provider event ID.
4. Persist/detect duplicate.
5. Return provider-appropriate response quickly.
6. Process idempotently.
7. Record success/failure and retry strategy.

## Failure Strategy
External timeout does not imply business failure. Persist enough provider identity/state to reconcile uncertain outcomes.

## Secrets
All provider credentials come from environment/secret management. Never commit them to repository or expose them to frontend bundles.


---

## Payment Provider — Xendit

| Property | Value |
|----------|-------|
| Provider | Xendit |
| Integration | REST API + Webhooks |
| Methods | QRIS, Virtual Account, E-Wallet, Credit/Debit Card |
| Webhook | POST callback with signature verification |
| Idempotency | External payment ID + event deduplication |

### Architecture

```text
PaymentProvider (interface)
    ↓
XenditPaymentProvider (implementation)
    ↓
Xendit REST API
```

### Key Rules

- Verify webhook signature before processing.
- Process each webhook event exactly once (idempotent).
- Store external payment ID, amount, method, status, gateway fee.
- Support expiration, failure, and refund.
- Never store Xendit API keys in frontend or logs.

---

## Shipping Provider — Biteship

| Property | Value |
|----------|-------|
| Provider | Biteship |
| Integration | REST API + Webhooks |
| Scope | Product Instant Delivery only |
| Couriers | GoSend, GrabExpress, Lalamove (via Biteship) |

### Architecture

```text
ShippingProvider (interface)
    ↓
BiteshipShippingProvider (implementation)
    ↓
Biteship API
```

### Key Rules

- Quote shipping rates based on origin + destination + weight.
- Create shipment after checkout confirmation.
- Process tracking webhooks idempotently.
- Never use Biteship for pet/live animal transport.
- Provider swap (direct GoSend/Grab) must not change order domain.

---

## Pet Transport

Pet transport is NOT a shipping provider integration. It is a merchant-managed service.

```text
PetTransportService
    ├── CustomerTransport (fee = Rp0)
    └── MerchantPetTransport (merchant pricing/config)
```

No external transport API integration for MVP. Merchant manages their own drivers/vehicles.
