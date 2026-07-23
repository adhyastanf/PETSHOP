package com.petshop.api.entity.product;

import com.petshop.api.entity.base.AuditableEntity;
import com.petshop.api.entity.merchant.Merchant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "slug", nullable = false, length = 300)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "condition", length = 20)
    private String condition;

    @Column(name = "min_purchase_qty")
    private Integer minPurchaseQty;

    @Column(name = "rating_average", precision = 3, scale = 2)
    private BigDecimal ratingAverage;

    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount;

    @Column(name = "sold_count", nullable = false)
    private Long soldCount;
}
