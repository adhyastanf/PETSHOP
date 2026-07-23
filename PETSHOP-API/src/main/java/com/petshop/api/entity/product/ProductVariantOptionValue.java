package com.petshop.api.entity.product;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_variant_option_values")
@IdClass(ProductVariantOptionValueId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantOptionValue {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_value_id", nullable = false)
    private ProductOptionValue optionValue;
}
