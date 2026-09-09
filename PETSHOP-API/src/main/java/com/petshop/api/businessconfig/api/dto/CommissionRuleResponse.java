package com.petshop.api.businessconfig.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Admin-facing view of a commission rule.
 *
 * @param id             rule id
 * @param transactionType PRODUCT | SERVICE
 * @param scope          GLOBAL | CATEGORY | MERCHANT (derived from merchantId/categoryId)
 * @param merchantId     target merchant (MERCHANT scope), nullable
 * @param categoryId     target category (CATEGORY scope), nullable
 * @param commissionType PERCENTAGE | FIXED
 * @param commissionValue percentage (0-100) or fixed IDR amount
 * @param priority       higher wins on ties within the same effective window
 * @param validFrom      effective start (inclusive), nullable = open start
 * @param validUntil     effective end (exclusive), nullable = open end
 * @param isActive       whether the rule is active
 */
public record CommissionRuleResponse(
        UUID id,
        String transactionType,
        String scope,
        UUID merchantId,
        UUID categoryId,
        String commissionType,
        BigDecimal commissionValue,
        Integer priority,
        Instant validFrom,
        Instant validUntil,
        Boolean isActive
) {
}
