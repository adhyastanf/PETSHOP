package com.petshop.api.entity.finance;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.merchant.Merchant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "settlements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settlement extends BaseEntity {

    @Column(name = "settlement_number", nullable = false, unique = true, length = 50)
    private String settlementNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @Column(name = "gross_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal grossAmount;

    @Column(name = "commission_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal commissionAmount;

    @Column(name = "refund_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "net_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal netAmount;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "available_at")
    private Instant availableAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
