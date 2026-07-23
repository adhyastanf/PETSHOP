package com.petshop.api.entity.finance;

import com.petshop.api.entity.merchant.Merchant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "merchant_wallets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantWallet {

    @Id
    @Column(name = "merchant_id", updatable = false, nullable = false)
    private UUID merchantId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;

    @Column(name = "pending_balance", nullable = false, precision = 19, scale = 2)
    private BigDecimal pendingBalance;

    @Column(name = "available_balance", nullable = false, precision = 19, scale = 2)
    private BigDecimal availableBalance;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
