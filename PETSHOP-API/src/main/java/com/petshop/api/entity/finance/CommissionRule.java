package com.petshop.api.entity.finance;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.merchant.Merchant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "commission_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommissionRule extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;

    @Column(name = "transaction_type", nullable = false, length = 20)
    private String transactionType;

    @Column(name = "category_id")
    private UUID categoryId;

    @Column(name = "commission_type", nullable = false, length = 20)
    private String commissionType;

    @Column(name = "commission_value", nullable = false, precision = 19, scale = 4)
    private BigDecimal commissionValue;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "valid_from")
    private Instant validFrom;

    @Column(name = "valid_until")
    private Instant validUntil;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
