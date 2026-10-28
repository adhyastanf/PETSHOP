package com.petshop.api.platform.shipping;

/**
 * A single tracking event in a shipment's history.
 *
 * @param timestamp   ISO-8601 timestamp of the event
 * @param status      event status code
 * @param description human-readable event description
 */
public record TrackingEvent(
        String timestamp,
        String status,
        String description
) {}
