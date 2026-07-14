package com.petshop.api.entity;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "petshops")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Petshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "shop_name", nullable = false, length = 200)
    private String shopName;

    private String description;
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String province;

    @Column(name = "postal_code", length = 10)
    private String postalCode;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(length = 20)
    private String phone;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "rating_avg", precision = 2, scale = 1)
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

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
