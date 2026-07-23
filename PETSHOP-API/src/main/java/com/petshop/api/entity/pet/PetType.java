package com.petshop.api.entity.pet;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pet_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetType extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
