package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * The core veterinary concept entity. Each row represents one stable,
 * species-aware clinical entity in the Oyen Veterinary Medical Master.
 *
 * <p>The UUID primary key (inherited from {@link BaseEntity}) is Oyen's own
 * stable identifier. External codes (SCTIDs, ICD codes) live in
 * {@link VetConceptExternalMapping} — they are never the primary key here.
 *
 * <p>concept_type values: DISEASE | SYNDROME | CLINICAL_FINDING | SYMPTOM |
 *   SIGN | INJURY | INFECTIOUS_AGENT | NEOPLASM | CONGENITAL_CONDITION |
 *   HEREDITARY_CONDITION | METABOLIC_ENDOCRINE | NUTRITIONAL_CONDITION |
 *   BEHAVIORAL_CONDITION | PREVENTIVE_CARE_CONCEPT | PARASITIC_CONDITION |
 *   PROCEDURE | OBSERVABLE_ENTITY | MEDICATION | VACCINE | BODY_STRUCTURE
 *
 * <p>status values: PENDING_REVIEW | ACTIVE | DEPRECATED | REJECTED
 *
 * <p>Concepts are never hard-deleted once active — use status=DEPRECATED and
 * set replaced_by to point to a successor.
 */
@Entity
@Table(name = "vet_concept")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetConcept extends BaseEntity {

    /** Human-readable stable code, e.g. "DIAG-ENDO-001". Unique, never reused. */
    @Column(name = "canonical_code", nullable = false, unique = true, length = 30)
    private String canonicalCode;

    /**
     * Concept classification. See class-level Javadoc for allowed values.
     * Validated at the service layer; stored as VARCHAR to avoid migration
     * overhead when new types are introduced.
     */
    @Column(name = "concept_type", nullable = false, length = 30)
    private String conceptType;

    /**
     * Primary body system. Nullable — not all concepts map to a single system.
     * See body_system values in VETERINARY_MEDICAL_MASTER.md §4.
     */
    @Column(name = "body_system", length = 30)
    private String bodySystem;

    /** PENDING_REVIEW | ACTIVE | DEPRECATED | REJECTED */
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    /** Terminology version active when this concept was introduced or last modified. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "version_id", nullable = false)
    private VetTerminologyVersion version;

    /** Optional: the authoritative source for this concept's provenance. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private VetSource source;

    /** Free-text provenance note, e.g. "WSAVA VGG 2024 §3.2". */
    @Column(name = "source_reference", columnDefinition = "TEXT")
    private String sourceReference;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /** UUID of the Oyen user who created/imported this concept. Nullable for seeded data. */
    @Column(name = "created_by")
    private UUID createdBy;

    /** UUID of the veterinary reviewer who approved this concept. */
    @Column(name = "reviewed_by")
    private UUID reviewedBy;

    @Column(name = "deprecated_at")
    private Instant deprecatedAt;

    @Column(name = "deprecated_reason", columnDefinition = "TEXT")
    private String deprecatedReason;

    /**
     * When deprecated, points to the successor concept. Concepts are never
     * hard-deleted; historical records that referenced a deprecated concept_id
     * remain valid and unchanged.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "replaced_by_concept_id")
    private VetConcept replacedBy;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (this.status == null) {
            this.status = "PENDING_REVIEW";
        }
    }
}
