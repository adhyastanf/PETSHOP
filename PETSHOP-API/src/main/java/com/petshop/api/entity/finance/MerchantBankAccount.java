package com.petshop.api.entity.finance;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.merchant.Merchant;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "merchant_bank_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantBankAccount extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @Column(name = "bank_code", nullable = false, length = 20)
    private String bankCode;

    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @Column(name = "account_number_encrypted", nullable = false, columnDefinition = "TEXT")
    private String accountNumberEncrypted;

    @Column(name = "account_number_last4", nullable = false, length = 4)
    private String accountNumberLast4;

    @Column(name = "account_holder_name", nullable = false, length = 200)
    private String accountHolderName;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
