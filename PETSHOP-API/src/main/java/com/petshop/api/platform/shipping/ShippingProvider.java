package com.petshop.api.platform.shipping;

import java.util.List;

/**
 * Platform abstraction for shipping/logistics provider integration.
 * Business modules depend on this interface, never on vendor SDKs.
 */
public interface ShippingProvider {

    /**
     * Get shipping quotes for a package.
     *
     * @param request quote request details
     * @return list of available shipping options with costs
     */
    List<ShippingQuote> getQuotes(ShippingQuoteRequest request);

    /**
     * Create a shipment with the provider.
     *
     * @param request shipment creation details
     * @return result containing tracking number and status
     */
    ShipmentResult createShipment(CreateShipmentRequest request);

    /**
     * Track an existing shipment.
     *
     * @param trackingNumber the tracking number
     * @return current tracking status and events
     */
    ShipmentTracking trackShipment(String trackingNumber);
}
