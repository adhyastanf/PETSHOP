package com.petshop.api.entity.veterinary;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

/** Composite primary key for {@link VetConceptSpecies}. */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class VetConceptSpeciesId implements Serializable {

    @Column(name = "concept_id")
    private UUID conceptId;

    @Column(name = "pet_type_id")
    private UUID petTypeId;
}
