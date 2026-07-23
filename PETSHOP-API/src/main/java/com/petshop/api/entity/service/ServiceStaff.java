package com.petshop.api.entity.service;

import com.petshop.api.entity.merchant.MerchantBranch;
import com.petshop.api.entity.staff.MerchantStaff;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_staff")
@IdClass(ServiceStaffId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceStaff {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private MerchantStaff staff;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;
}
