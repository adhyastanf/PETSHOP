package com.petshop.api.entity.finance;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "settlement_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettlementItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "settlement_id", nullable = false)
    private Settlement settlement;

    @Column(name = "order_id")
    private UUID orderId;

    @Column(name = "booking_id")
    private UUID bookingId;

    @Column(name = "gross_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal grossAmount;

    @Column(name = "commission_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal commissionAmount;

    @Column(name = "net_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal netAmount;
}
