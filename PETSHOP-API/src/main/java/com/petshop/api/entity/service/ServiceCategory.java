package com.petshop.api.entity.service;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "service_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCategory extends BaseEntity {

    @Column(name = "parent_id")
    private UUID parentId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "slug", nullable = false, unique = true, length = 180)
    private String slug;

    @Column(name = "is_veterinary", nullable = false)
    private Boolean isVeterinary;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
