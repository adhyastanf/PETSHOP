package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.pet.PetType;
import jakarta.persistence.*;
import lombok.*;

/**
 * Many-to-many join: which species (from the existing pet_types table) does
 * a veterinary concept apply to?
 *
 * <p>Uses the existing {@link PetType} reference table — no duplicate species
 * table is created. DOG and CAT are already seeded; future species (BIRD,
 * REPTILE, etc.) require no schema change.
 */
@Entity
@Table(name = "vet_concept_species")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetConceptSpecies {

    @EmbeddedId
    private VetConceptSpeciesId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("conceptId")
    @JoinColumn(name = "concept_id")
    private VetConcept concept;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("petTypeId")
    @JoinColumn(name = "pet_type_id")
    private PetType petType;
}
