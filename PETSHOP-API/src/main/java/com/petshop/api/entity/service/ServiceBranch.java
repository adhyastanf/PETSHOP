package com.petshop.api.entity.service;

import com.petshop.api.entity.merchant.MerchantBranch;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_branches")
@IdClass(ServiceBranchId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceBranch {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
