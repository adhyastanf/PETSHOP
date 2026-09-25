package com.petshop.api.entity.veterinary;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Clinical Knowledge Layer (Layer 2) — informational reference notes about a
 * single {@link VetConcept}. One row per concept (1-to-1 shared-PK extension).
 *
 * <p>The primary key {@code conceptId} is the same UUID as the parent
 * {@link VetConcept}. The mapping follows the canonical Oyen 1:1 shared-PK
 * pattern (see {@code VeterinarianProfile} for the same approach):
 * an explicit {@code @Id UUID} field populated by {@code @MapsId},
 * rather than {@code @Id @OneToOne} which is less reliable with Hibernate 6
 * lazy-loading proxies.
 *
 * <p><strong>Critical safety constraint:</strong> This layer provides
 * informational context to veterinarians only. It must NEVER generate
 * diagnoses, treatment plans, prescriptions, or referrals. All fields are
 * free-text reference notes, not structured decision trees.
 *
 * <p>Editable only by authorised Oyen veterinary reviewers via the admin
 * workflow — never by clinical users through the patient-record interface.
 *
 * <p>The {@code common_clinical_signs_note} is particularly sensitive and
 * must never be surfaced to end users as "your pet has these signs → this
 * disease". Its purpose is to help veterinarians recall associated findings.
 */
@Entity
@Table(name = "vet_concept_knowledge")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetConceptKnowledge {

    /**
     * Primary key — same UUID as the parent {@link VetConcept}.
     * Populated via {@code @MapsId} from the {@code concept} association.
     */
    @Id
    @Column(name = "concept_id", nullable = false, updatable = false)
    private UUID conceptId;

    /**
     * The concept this knowledge entry describes.
     * {@code @MapsId} ensures {@code conceptId} is populated from
     * {@code concept.getId()} before persist.
     */
    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id", nullable = false)
    private VetConcept concept;

    /** e.g. "Common in senior cats; rare in dogs" — species/prevalence context. */
    @Column(name = "species_prevalence_note", columnDefinition = "TEXT")
    private String speciesPrevalenceNote;

    /** General reference note about typical age of onset. */
    @Column(name = "typical_age_of_onset", columnDefinition = "TEXT")
    private String typicalAgeOfOnset;

    /**
     * INFORMATIONAL ONLY — must never be used to auto-diagnose.
     * Purpose: help veterinarians recall associated clinical signs.
     */
    @Column(name = "common_clinical_signs_note", columnDefinition = "TEXT")
    private String commonClinicalSignsNote;

    /** e.g. "Regular bloodwork for DM management". */
    @Column(name = "monitoring_considerations", columnDefinition = "TEXT")
    private String monitoringConsiderations;

    /** e.g. "Annual titre testing recommended". */
    @Column(name = "preventive_care_note", columnDefinition = "TEXT")
    private String preventiveCareNote;

    /** e.g. "WSAVA VGG 2024" */
    @Column(name = "clinical_guideline_ref", columnDefinition = "TEXT")
    private String clinicalGuidelineRef;

    @Column(name = "guideline_version", length = 50)
    private String guidelineVersion;

    /** e.g. "Merck Vet Manual, Endocrine §" */
    @Column(name = "source_reference", columnDefinition = "TEXT")
    private String sourceReference;

    @Column(name = "last_reviewed_at")
    private Instant lastReviewedAt;
}
