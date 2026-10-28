package com.petshop.api.platform.shipping;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Mock implementation of {@link ShippingProvider}.
 * Returns predefined shipping quotes and tracking data.
 * Suitable for local development and testing.
 */
@Slf4j
@Service
public class MockShippingProvider implements ShippingProvider {

    @Override
    public List<ShippingQuote> getQuotes(ShippingQuoteRequest request) {
        log.info("=== MOCK SHIPPING QUOTES ===");
        log.info("Origin: {}, Destination: {}, Weight: {} kg",
                request.originPostalCode(), request.destinationPostalCode(), request.weightKg());

        List<ShippingQuote> quotes = List.of(
                new ShippingQuote("JNE", "REG", new BigDecimal("15000"), 3),
                new ShippingQuote("JNE", "YES", new BigDecimal("25000"), 1),
                new ShippingQuote("J&T", "EZ", new BigDecimal("12000"), 4),
                new ShippingQuote("SiCepat", "BEST", new BigDecimal("14000"), 2)
        );

        log.info("Returning {} mock quotes", quotes.size());
        log.info("=== END MOCK SHIPPING QUOTES ===");
        return quotes;
    }

    @Override
    public ShipmentResult createShipment(CreateShipmentRequest request) {
        String trackingNumber = "MOCK-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();

        log.info("=== MOCK SHIPMENT CREATED ===");
        log.info("Quote: {}", request.quoteId());
        log.info("Sender: {}", request.senderName());
        log.info("Recipient: {} at {}", request.recipientName(), request.recipientAddress());
        log.info("Tracking: {}", trackingNumber);
        log.info("=== END MOCK SHIPMENT ===");

        return new ShipmentResult(trackingNumber, "MockCourier", "PICKUP_SCHEDULED");
    }

    @Override
    public ShipmentTracking trackShipment(String trackingNumber) {
        log.info("Mock tracking lookup for: {}", trackingNumber);

        List<TrackingEvent> events = List.of(
                new TrackingEvent(Instant.now().minusSeconds(86400).toString(), "PICKED_UP", "Package picked up from sender"),
                new TrackingEvent(Instant.now().minusSeconds(43200).toString(), "IN_TRANSIT", "Package in transit to destination city"),
                new TrackingEvent(Instant.now().toString(), "OUT_FOR_DELIVERY", "Package out for delivery")
        );

        return new ShipmentTracking(trackingNumber, "OUT_FOR_DELIVERY", events);
    }
}
