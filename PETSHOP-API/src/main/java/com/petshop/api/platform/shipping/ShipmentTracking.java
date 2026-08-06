package com.petshop.api.platform.shipping;

import java.util.List;

/**
 * Tracking information for a shipment.
 *
 * @param trackingNumber the tracking number
 * @param status         current shipment status
 * @param events         tracking event history
 */
public record ShipmentTracking(
        String trackingNumber,
        String status,
        List<TrackingEvent> events
) {}
