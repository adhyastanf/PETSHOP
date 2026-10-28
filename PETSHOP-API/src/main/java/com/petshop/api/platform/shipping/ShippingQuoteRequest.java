package com.petshop.api.platform.shipping;

/**
 * Request for shipping quotes.
 *
 * @param originPostalCode      sender postal code
 * @param destinationPostalCode recipient postal code
 * @param weightKg              package weight in kilograms
 */
public record ShippingQuoteRequest(
        String originPostalCode,
        String destinationPostalCode,
        double weightKg
) {}
