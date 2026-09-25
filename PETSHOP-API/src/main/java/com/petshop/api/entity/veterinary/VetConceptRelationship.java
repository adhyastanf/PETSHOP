package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Lightweight semantic relationship between two {@link VetConcept} records.
 *
 * <p>Supports IS_A hierarchy and other semantic links for search expansion,
 * reporting roll-up, and future decision-support features. The full SNOMED CT
 * polyhierarchy complexity is intentionally NOT replicated here.
 *
 * <p>relationship_type values: IS_A | HAS_COMPONENT | CAUSED_BY | ASSOCIATED_WITH
 *
 * <p>At most one primary parent per child concept is enforced by a partial
 * unique index in the database (idx_vet_concept_rel_one_primary).
 * The service layer also enforces: no circular relationships.
 */
@Entity
@Table(name = "vet_concept_relationship")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetConceptRelationship extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_concept_id", nullable = false)
    private VetConcept childConcept;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_concept_id", nullable = false)
    private VetConcept parentConcept;

    /** IS_A | HAS_COMPONENT | CAUSED_BY | ASSOCIATED_WITH */
    @Column(name = "relationship_type", nullable = false, length = 30)
    private String relationshipType;

    /**
     * True if this is the primary (most clinically dominant) parent.
     * A partial unique index ensures at most one primary parent per child.
     */
    @Column(name = "is_primary_parent", nullable = false)
    private Boolean isPrimaryParent;
}
