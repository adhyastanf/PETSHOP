package com.petshop.api.entity.finance;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.identity.User;
import com.petshop.api.entity.merchant.Merchant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "withdrawals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Withdrawal extends BaseEntity {

    @Column(name = "withdrawal_number", nullable = false, unique = true, length = 50)
    private String withdrawalNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_account_id", nullable = false)
    private MerchantBankAccount bankAccount;

    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "admin_fee", nullable = false, precision = 19, scale = 2)
    private BigDecimal adminFee;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "requested_at", nullable = false)
    private Instant requestedAt;

    @Column(name = "processed_at")
    private Instant processedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private User processedBy;

    @Column(name = "external_reference", length = 255)
    private String externalReference;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
}
