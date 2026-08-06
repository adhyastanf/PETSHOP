package com.petshop.api.platform.payment;

/**
 * Result of a payment creation operation.
 *
 * @param externalId the external payment identifier from the provider
 * @param paymentUrl URL to redirect the user for payment completion
 * @param status     initial payment status
 */
public record PaymentResult(
        String externalId,
        String paymentUrl,
        String status
) {}
