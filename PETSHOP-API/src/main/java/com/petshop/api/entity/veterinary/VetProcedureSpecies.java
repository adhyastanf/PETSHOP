package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.pet.PetType;
import jakarta.persistence.*;
import lombok.*;

/**
 * Many-to-many join: which species (from the existing pet_types table) does
 * a {@link VetProcedure} apply to?
 */
@Entity
@Table(name = "vet_procedure_species")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetProcedureSpecies {

    @EmbeddedId
    private VetProcedureSpeciesId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("procedureId")
    @JoinColumn(name = "procedure_id")
    private VetProcedure procedure;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("petTypeId")
    @JoinColumn(name = "pet_type_id")
    private PetType petType;
}
