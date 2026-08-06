package com.petshop.api.platform.payment;

import java.math.BigDecimal;

/**
 * Request to create a payment with the external provider.
 *
 * @param orderId     internal order identifier
 * @param amount      payment amount
 * @param currency    ISO 4217 currency code (e.g. "IDR")
 * @param method      payment method identifier
 * @param callbackUrl webhook callback URL for payment status updates
 */
public record CreatePaymentRequest(
        String orderId,
        BigDecimal amount,
        String currency,
        String method,
        String callbackUrl
) {}
