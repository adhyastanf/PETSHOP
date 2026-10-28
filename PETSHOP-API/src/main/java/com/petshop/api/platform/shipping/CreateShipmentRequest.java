package com.petshop.api.platform.shipping;

/**
 * Request to create a shipment with the provider.
 *
 * @param quoteId          the selected quote identifier
 * @param senderName       sender name
 * @param recipientName    recipient name
 * @param recipientAddress recipient full address
 * @param recipientPhone   recipient phone number
 */
public record CreateShipmentRequest(
        String quoteId,
        String senderName,
        String recipientName,
        String recipientAddress,
        String recipientPhone
) {}
