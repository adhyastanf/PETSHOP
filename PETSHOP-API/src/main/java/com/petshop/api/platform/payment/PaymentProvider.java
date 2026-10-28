package com.petshop.api.platform.payment;

/**
 * Platform abstraction for payment gateway integration.
 * Business modules depend on this interface, never on vendor SDKs.
 */
public interface PaymentProvider {

    /**
     * Create a payment with the external provider.
     *
     * @param request payment creation details
     * @return result containing external ID and payment URL
     */
    PaymentResult createPayment(CreatePaymentRequest request);

    /**
     * Check the status of a payment by its external ID.
     *
     * @param externalPaymentId the external payment identifier
     * @return current payment status
     */
    PaymentStatus checkStatus(String externalPaymentId);

    /**
     * Verify a webhook signature from the payment provider.
     *
     * @param payload   raw webhook payload
     * @param signature signature header value
     * @return true if signature is valid
     */
    boolean verifyWebhookSignature(String payload, String signature);
}
