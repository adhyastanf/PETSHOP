package com.petshop.api.entity.staff;

import com.petshop.api.entity.base.AuditableEntity;
import com.petshop.api.entity.identity.User;
import com.petshop.api.entity.merchant.Merchant;
import com.petshop.api.entity.rbac.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "merchant_staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantStaff extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "employee_code", length = 100)
    private String employeeCode;

    @Column(name = "display_name", length = 150)
    private String displayName;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "joined_at")
    private LocalDate joinedAt;
}
