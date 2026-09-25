package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.pet.PetType;
import jakarta.persistence.*;
import lombok.*;

/**
 * An alternative name for a {@link VetConcept}.
 *
 * <p>synonym_type values: VETERINARY_PROFESSIONAL | COMMON_OWNER |
 *   ABBREVIATION | ALTERNATE_SPELLING | TRADE_NAME | EXTERNAL_PREFERRED
 *
 * <p>pet_type_id is optional; when set, the synonym applies only to that
 * species (e.g. "Canine rabies" is DOG-specific; "Feline rabies" is CAT-specific,
 * even though both link to the same "Rabies" concept).
 */
@Entity
@Table(name = "vet_concept_synonym")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetConceptSynonym extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id", nullable = false)
    private VetConcept concept;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    @Column(name = "synonym_text", nullable = false, columnDefinition = "TEXT")
    private String synonymText;

    /**
     * Synonym classification.
     * Allowed: VETERINARY_PROFESSIONAL | COMMON_OWNER | ABBREVIATION |
     *          ALTERNATE_SPELLING | TRADE_NAME | EXTERNAL_PREFERRED
     */
    @Column(name = "synonym_type", nullable = false, length = 30)
    private String synonymType;

    /**
     * Optional species scope. When non-null, this synonym is valid only for
     * the named species. Uses the existing pet_types reference table.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_type_id")
    private PetType petType;
}
