package com.petshop.api.entity.service;

import com.petshop.api.entity.base.AuditableEntity;
import com.petshop.api.entity.merchant.Merchant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntity extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "confirmation_mode", nullable = false, length = 30)
    private String confirmationMode;

    @Column(name = "requires_pet", nullable = false)
    private Boolean requiresPet;

    @Column(name = "requires_verified_veterinarian", nullable = false)
    private Boolean requiresVerifiedVeterinarian;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "rating_average", precision = 3, scale = 2)
    private BigDecimal ratingAverage;

    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount;
}
