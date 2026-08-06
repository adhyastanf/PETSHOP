package com.petshop.api.platform.shipping;

/**
 * Result of a shipment creation.
 *
 * @param trackingNumber tracking number from the courier
 * @param courier        courier name
 * @param status         initial shipment status
 */
public record ShipmentResult(
        String trackingNumber,
        String courier,
        String status
) {}
