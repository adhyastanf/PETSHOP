package com.petshop.api.entity.order;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.product.Product;
import com.petshop.api.entity.product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "variant_name", length = 255)
    private String variantName;

    @Column(name = "sku", length = 100)
    private String sku;

    @Column(name = "unit_price", nullable = false, precision = 19, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "subtotal", nullable = false, precision = 19, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount_amount", precision = 19, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "final_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
