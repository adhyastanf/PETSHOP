package com.petshop.api.platform.shipping;

import java.math.BigDecimal;

/**
 * A shipping option/quote from a courier.
 *
 * @param courier       courier name (e.g. "JNE", "J&T")
 * @param service       service level (e.g. "REG", "EXPRESS")
 * @param cost          shipping cost
 * @param estimatedDays estimated delivery time in days
 */
public record ShippingQuote(
        String courier,
        String service,
        BigDecimal cost,
        int estimatedDays
) {}
