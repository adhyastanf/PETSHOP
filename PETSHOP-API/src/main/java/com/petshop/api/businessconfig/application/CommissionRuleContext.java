package com.petshop.api.businessconfig.application;

import java.time.Instant;
import java.util.UUID;

/**
 * Immutable input to {@link CommissionRuleResolver}. Describes the transaction
 * for which the applicable commission rule must be determined.
 *
 * @param transactionType PRODUCT or SERVICE
 * @param merchantId      the merchant, nullable
 * @param categoryId      the product/service category, nullable
 * @param at              the effective timestamp to evaluate against (e.g. order creation time)
 */
public record CommissionRuleContext(
        String transactionType,
        UUID merchantId,
        UUID categoryId,
        Instant at
) {
}
