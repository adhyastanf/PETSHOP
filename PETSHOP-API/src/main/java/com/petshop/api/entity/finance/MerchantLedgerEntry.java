package com.petshop.api.entity.finance;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.merchant.Merchant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "merchant_ledger_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantLedgerEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @Column(name = "order_id")
    private UUID orderId;

    @Column(name = "booking_id")
    private UUID bookingId;

    @Column(name = "refund_id")
    private UUID refundId;

    @Column(name = "entry_type", nullable = false, length = 30)
    private String entryType;

    @Column(name = "balance_type", nullable = false, length = 30)
    private String balanceType;

    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
