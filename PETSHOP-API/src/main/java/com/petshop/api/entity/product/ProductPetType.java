package com.petshop.api.entity.product;

import com.petshop.api.entity.pet.PetType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_pet_types")
@IdClass(ProductPetTypeId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPetType {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_type_id", nullable = false)
    private PetType petType;
}
