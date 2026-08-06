package com.petshop.api.platform.payment;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Mock implementation of {@link PaymentProvider}.
 * Returns successful mock responses with generated IDs.
 * Suitable for local development and testing.
 */
@Slf4j
@Service
public class MockPaymentProvider implements PaymentProvider {

    @Override
    public PaymentResult createPayment(CreatePaymentRequest request) {
        String externalId = "MOCK-PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String paymentUrl = "https://mock-payment.local/pay/" + externalId;

        log.info("=== MOCK PAYMENT CREATED ===");
        log.info("Order: {}", request.orderId());
        log.info("Amount: {} {}", request.amount(), request.currency());
        log.info("Method: {}", request.method());
        log.info("External ID: {}", externalId);
        log.info("Payment URL: {}", paymentUrl);
        log.info("=== END MOCK PAYMENT ===");

        return new PaymentResult(externalId, paymentUrl, "PENDING");
    }

    @Override
    public PaymentStatus checkStatus(String externalPaymentId) {
        log.info("Mock checkStatus called for: {}", externalPaymentId);
        // Always returns PAID for mock purposes
        return new PaymentStatus(externalPaymentId, "PAID", java.math.BigDecimal.ZERO);
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signature) {
        log.info("Mock webhook signature verification (always returns true)");
        return true;
    }
}
