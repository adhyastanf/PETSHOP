package com.petshop.api.businessconfig.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Request to update a commission rule. All fields optional; only non-null
 * fields are applied. Business validation is enforced server-side.
 */
public record UpdateCommissionRuleRequest(
        String transactionType,
        String commissionType,
        BigDecimal commissionValue,
        UUID merchantId,
        UUID categoryId,
        Integer priority,
        Instant validFrom,
        Instant validUntil,
        Boolean isActive
) {
}
