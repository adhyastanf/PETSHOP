package com.petshop.api.entity.service;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.pet.PetBreed;
import com.petshop.api.entity.pet.PetType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "service_prices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicePrice extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_type_id")
    private PetType petType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breed_id")
    private PetBreed breed;

    @Column(name = "min_weight_kg", precision = 7, scale = 2)
    private BigDecimal minWeightKg;

    @Column(name = "max_weight_kg", precision = 7, scale = 2)
    private BigDecimal maxWeightKg;

    @Column(name = "label", length = 100)
    private String label;

    @Column(name = "price", nullable = false, precision = 19, scale = 2)
    private BigDecimal price;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
