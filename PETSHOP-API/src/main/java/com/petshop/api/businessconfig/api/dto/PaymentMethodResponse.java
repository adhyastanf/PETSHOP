package com.petshop.api.businessconfig.api.dto;

import java.util.UUID;

/**
 * Admin-facing view of a payment method availability entry.
 */
public record PaymentMethodResponse(
        UUID id,
        String providerCode,
        String methodCode,
        String name,
        String type,
        boolean isActive,
        Integer sortOrder
) {
}
