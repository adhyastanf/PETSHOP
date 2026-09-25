package com.petshop.api.entity.veterinary;

import jakarta.persistence.*;
import lombok.*;

/**
 * Canonical display name for a {@link VetConcept} in one language.
 *
 * <p>One row per concept per language. English ("en") and Indonesian ("id")
 * are both required before a concept can transition to ACTIVE status.
 * Validation of this requirement is enforced at the service layer.
 */
@Entity
@Table(name = "vet_concept_name")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetConceptName {

    @EmbeddedId
    private VetConceptNameId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("conceptId")
    @JoinColumn(name = "concept_id")
    private VetConcept concept;

    @Column(name = "name", nullable = false, columnDefinition = "TEXT")
    private String name;
}
