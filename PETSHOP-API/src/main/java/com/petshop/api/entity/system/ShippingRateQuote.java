package com.petshop.api.entity.system;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.checkout.Checkout;
import com.petshop.api.entity.merchant.MerchantBranch;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "shipping_rate_quotes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingRateQuote extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checkout_id", nullable = false)
    private Checkout checkout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;

    @Column(name = "provider", nullable = false, length = 50)
    private String provider;

    @Column(name = "courier_code", length = 50)
    private String courierCode;

    @Column(name = "service_code", length = 50)
    private String serviceCode;

    @Column(name = "service_name", length = 100)
    private String serviceName;

    @Column(name = "cost", nullable = false, precision = 19, scale = 2)
    private BigDecimal cost;

    @Column(name = "estimated_days_min")
    private Integer estimatedDaysMin;

    @Column(name = "estimated_days_max")
    private Integer estimatedDaysMax;

    @Column(name = "external_quote_id", length = 255)
    private String externalQuoteId;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "selected", nullable = false)
    private Boolean selected;

    @Column(name = "raw_payload", columnDefinition = "jsonb")
    private String rawPayload;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
