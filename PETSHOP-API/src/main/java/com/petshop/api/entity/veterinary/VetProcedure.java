package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * A veterinary procedure in the Oyen Procedure Master.
 *
 * <p>Procedures (clinical interventions) are categorically distinct from
 * diagnoses/conditions and are stored in a separate table — never merged into
 * {@link VetConcept}. This table answers: <em>"What procedures exist?"</em>
 *
 * <p>It does NOT record: <em>"What procedure was performed on this specific pet?"</em>
 * — that belongs to the future {@code vet_encounter_procedure} patient-record table.
 *
 * <p>procedure_category values: EXAMINATION | DIAGNOSTIC_TEST | IMAGING |
 *   PREVENTIVE_PROCEDURE | THERAPEUTIC_PROCEDURE | SURGICAL_PROCEDURE |
 *   ANAESTHESIA | HOSPITALISATION | DENTAL_PROCEDURE | EUTHANASIA
 *
 * <p>status values: PENDING_REVIEW | ACTIVE | DEPRECATED | REJECTED
 *
 * <p>Procedures are never hard-deleted once referenced — use status=DEPRECATED.
 */
@Entity
@Table(name = "vet_procedure")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetProcedure extends BaseEntity {

    /** Human-readable stable code, e.g. "PROC-EXM-001". Unique, never reused. */
    @Column(name = "canonical_code", nullable = false, unique = true, length = 30)
    private String canonicalCode;

    /**
     * Top-level procedure category.
     * See VETERINARY_PROCEDURES.md §3 for the full sub-type taxonomy.
     */
    @Column(name = "procedure_category", nullable = false, length = 30)
    private String procedureCategory;

    /** Fine-grained sub-classification within the category. */
    @Column(name = "procedure_subcategory", length = 50)
    private String procedureSubcategory;

    /**
     * Optional anatomical location. FK to a {@link VetConcept} with
     * concept_type = BODY_STRUCTURE.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "body_region_concept_id")
    private VetConcept bodyRegionConcept;

    /**
     * Informational: indicates whether the procedure typically requires
     * general anaesthesia. Actual anaesthesia use is recorded per encounter.
     */
    @Column(name = "requires_anaesthesia", nullable = false)
    private Boolean requiresAnaesthesia;

    /**
     * Informational: whether a licensed veterinarian must perform or supervise.
     * Mirrors the existing {@code services.requires_verified_veterinarian} flag.
     * Changes to this field trigger a version bump.
     */
    @Column(name = "requires_veterinarian", nullable = false)
    private Boolean requiresVeterinarian;

    @Column(name = "typical_duration_minutes")
    private Integer typicalDurationMinutes;

    /** For diagnostic procedures, e.g. "whole blood", "urine". */
    @Column(name = "specimen_type", columnDefinition = "TEXT")
    private String specimenType;

    @Column(name = "equipment_note", columnDefinition = "TEXT")
    private String equipmentNote;

    @Column(name = "clinical_guideline_ref", columnDefinition = "TEXT")
    private String clinicalGuidelineRef;

    /** PENDING_REVIEW | ACTIVE | DEPRECATED | REJECTED */
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "version_id", nullable = false)
    private VetTerminologyVersion version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private VetSource source;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "reviewed_by")
    private UUID reviewedBy;

    @Column(name = "deprecated_at")
    private Instant deprecatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "replaced_by_procedure_id")
    private VetProcedure replacedBy;

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
