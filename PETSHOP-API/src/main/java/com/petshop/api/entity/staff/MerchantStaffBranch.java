package com.petshop.api.entity.staff;

import com.petshop.api.entity.merchant.MerchantBranch;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "merchant_staff_branches")
@IdClass(MerchantStaffBranchId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantStaffBranch {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private MerchantStaff staff;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;
}
