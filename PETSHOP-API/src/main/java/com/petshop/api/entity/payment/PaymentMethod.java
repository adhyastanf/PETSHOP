package com.petshop.api.entity.payment;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_methods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod extends BaseEntity {

    @Column(name = "provider_code", nullable = false, length = 50)
    private String providerCode;

    @Column(name = "method_code", nullable = false, length = 50)
    private String methodCode;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "type", nullable = false, length = 30)
    private String type;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
