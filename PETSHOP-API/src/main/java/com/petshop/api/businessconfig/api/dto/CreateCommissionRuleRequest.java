package com.petshop.api.businessconfig.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Request to create a commission rule.
 *
 * <p>Structural validation only; business validation (scope consistency, range,
 * effective-date ordering, overlap prevention) is enforced server-side in the
 * service layer.
 */
public record CreateCommissionRuleRequest(
        @NotNull @Size(max = 20) String transactionType,
        @NotNull @Size(max = 20) String commissionType,
        @NotNull BigDecimal commissionValue,
        UUID merchantId,
        UUID categoryId,
        Integer priority,
        Instant validFrom,
        Instant validUntil,
        Boolean isActive
) {
}
