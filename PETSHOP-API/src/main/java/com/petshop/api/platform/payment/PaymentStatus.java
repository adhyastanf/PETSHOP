package com.petshop.api.platform.payment;

import java.math.BigDecimal;

/**
 * Status of an existing payment.
 *
 * @param externalId the external payment identifier
 * @param status     current status (e.g. "PENDING", "PAID", "FAILED", "EXPIRED")
 * @param amount     payment amount
 */
public record PaymentStatus(
        String externalId,
        String status,
        BigDecimal amount
) {}
