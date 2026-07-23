package com.petshop.api.entity.service;

import com.petshop.api.entity.pet.PetType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_pet_types")
@IdClass(ServicePetTypeId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicePetType {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_type_id", nullable = false)
    private PetType petType;
}
