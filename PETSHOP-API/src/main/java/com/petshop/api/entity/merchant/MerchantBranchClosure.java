package com.petshop.api.entity.merchant;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "merchant_branch_closures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantBranchClosure extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;

    @Column(name = "closure_date", nullable = false)
    private LocalDate closureDate;

    @Column(name = "is_closed", nullable = false)
    private Boolean isClosed;

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;

    @Column(name = "reason", length = 255)
    private String reason;
}
