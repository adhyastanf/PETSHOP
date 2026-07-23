package com.petshop.api.entity.order;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_provider_id", nullable = false)
    private ShippingProvider shippingProvider;

    @Column(name = "courier_code", length = 50)
    private String courierCode;

    @Column(name = "courier_name", length = 150)
    private String courierName;

    @Column(name = "service_code", length = 50)
    private String serviceCode;

    @Column(name = "service_name", length = 150)
    private String serviceName;

    @Column(name = "external_shipment_id", length = 255)
    private String externalShipmentId;

    @Column(name = "tracking_number", length = 150)
    private String trackingNumber;

    @Column(name = "shipping_cost", precision = 19, scale = 2)
    private BigDecimal shippingCost;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "estimated_delivery_at")
    private Instant estimatedDeliveryAt;

    @Column(name = "shipped_at")
    private Instant shippedAt;

    @Column(name = "delivered_at")
    private Instant deliveredAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
