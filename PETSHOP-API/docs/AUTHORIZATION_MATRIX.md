# Oyen — Authorization Matrix

This document describes defaults. Fine-grained RBAC permissions can narrow merchant/admin capabilities.

| Capability | Customer | Merchant Staff | Groomer/Vet | Merchant Admin | Owner | Platform Admin |
|---|---:|---:|---:|---:|---:|---:|
| Manage own profile | Yes | Yes | Yes | Yes | Yes | Yes |
| Manage own pets | Yes | No | No | No | No | No |
| Shop/book | Yes | No | No | No | No | No |
| Manage own addresses | Yes | No | No | No | No | No |
| View own orders/bookings | Yes | No | No | No | No | Admin scope |
| Create merchant product | No | Permission | Permission | Yes | Yes | Moderation only |
| Adjust merchant inventory | No | Permission | Permission | Yes | Yes | Admin override only |
| Manage merchant services | No | Permission | Permission | Yes | Yes | Moderation only |
| View merchant orders | No | Permission | Permission | Yes | Yes | Admin scope |
| Process merchant orders | No | Permission | Permission | Yes | Yes | Exceptional admin action |
| View merchant bookings | No | Permission | Assigned/permission | Yes | Yes | Admin scope |
| Confirm booking | No | Permission | Assigned/permission | Yes | Yes | Exceptional admin action |
| Perform service lifecycle | No | Permission | Assigned/permission | Yes | Yes | No normally |
| Manage staff | No | No | No | Permission | Yes | No |
| Manage branches | No | No | No | Permission | Yes | Admin review |
| View merchant finance | No | No | No | Permission | Yes | Authorized admin |
| Request withdrawal | No | No | No | Permission | Yes | No |
| Verify merchant | No | No | No | No | No | Permission |
| Verify veterinarian | No | No | No | No | No | Permission |
| Process withdrawal | No | No | No | No | No | Permission |
| Manage platform categories | No | No | No | No | No | Permission |
| Manage platform campaign | No | No | No | No | No | Permission |
| Resolve disputes | Own dispute | Merchant participant | Merchant participant | Merchant participant | Merchant participant | Permission |
| Manage RBAC | No | No | No | Merchant scope if allowed | Merchant scope if allowed | Permission |

## Ownership Rules
Authorization is always role/permission **plus resource ownership/scope**.

Examples:
- A `PETSHOP_ADMIN` cannot access another merchant by changing a URL UUID.
- Staff assigned to Branch A cannot automatically mutate Branch B.
- Customer may access only their own private order/booking/pet/address.
- Chat requires conversation membership.
- Private files inherit authorization from their owning business object.

## Backend Enforcement
Do not rely on Next.js route protection. Spring Security and application services enforce permissions and ownership.

## Admin Principle
Platform admin is not automatically omnipotent. Sensitive operations should require explicit permissions and audit logs.
