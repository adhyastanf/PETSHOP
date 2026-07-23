package com.petshop.api.entity.product;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_option_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOptionValue extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id", nullable = false)
    private ProductOption option;

    @Column(name = "value", nullable = false, length = 100)
    private String value;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
