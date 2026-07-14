package com.petshop.api.entity;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "petshop_id", nullable = false)
    private Petshop petshop;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String slug;

    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_price", precision = 12, scale = 2)
    private BigDecimal discountPrice;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "weight_gram")
    private Integer weightGram;

    @Column(length = 100)
    private String sku;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "rating_avg", precision = 2, scale = 1)
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "sold_count")
    private Integer soldCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }
}
