package com.petshop.api.entity.veterinary;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Extra attributes for {@link VetConcept} records with concept_type = 'VACCINE'.
 * Stored as a separate 1-to-1 shared-PK extension table so the core concept
 * table remains compact.
 *
 * <p>The primary key {@code conceptId} is the same UUID as the parent
 * {@link VetConcept}. The mapping follows the canonical Oyen 1:1 shared-PK
 * pattern (see {@code VeterinarianProfile} for the same approach):
 * an explicit {@code @Id UUID} field populated by {@code @MapsId},
 * rather than {@code @Id @OneToOne} which is less reliable with Hibernate 6
 * lazy-loading proxies.
 *
 * <p>vaccine_category values (WSAVA VGG 2024 classification):
 * CORE | NON_CORE | NOT_RECOMMENDED
 *
 * <p><strong>Important:</strong> {@code typical_initial_series} and
 * {@code typical_booster_interval} are informational reference fields only.
 * The actual vaccination schedule for a specific pet is always determined by
 * the attending veterinarian and recorded in the future medical record.
 * The master NEVER auto-schedules vaccinations.
 *
 * <p><strong>Type validation note:</strong> {@code diseasePrevented} should
 * reference a {@link VetConcept} with concept_type = 'PREVENTIVE_CARE_CONCEPT'.
 * This type constraint is enforced by the service layer at authoring time —
 * the database stores only the FK, consistent with Oyen conventions elsewhere.
 */
@Entity
@Table(name = "vet_vaccine_concept")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetVaccineConcept {

    /**
     * Primary key — same UUID as the parent {@link VetConcept}.
     * Populated via {@code @MapsId} from the {@code concept} association.
     */
    @Id
    @Column(name = "concept_id", nullable = false, updatable = false)
    private UUID conceptId;

    /**
     * The vaccine concept this row extends.
     * {@code @MapsId} ensures {@code conceptId} is populated from
     * {@code concept.getId()} before persist.
     */
    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id", nullable = false)
    private VetConcept concept;

    /**
     * The disease this vaccine is designed to prevent.
     * Expected to reference a VetConcept with concept_type = 'PREVENTIVE_CARE_CONCEPT'.
     * Type validation is enforced at the service layer (see class Javadoc).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disease_prevented_concept_id")
    private VetConcept diseasePrevented;

    /** CORE | NON_CORE | NOT_RECOMMENDED (WSAVA VGG 2024 classification). */
    @Column(name = "vaccine_category", nullable = false, length = 20)
    private String vaccineCategory;

    /**
     * General guideline reference note, e.g. "3 doses at 6/9/12 weeks".
     * Informational only — not an auto-scheduling rule.
     */
    @Column(name = "typical_initial_series", columnDefinition = "TEXT")
    private String typicalInitialSeries;

    /**
     * General guideline reference, e.g. "Every 1-3 years per titre testing".
     * Informational only — actual next_due_date is set by the veterinarian.
     */
    @Column(name = "typical_booster_interval", columnDefinition = "TEXT")
    private String typicalBoosterInterval;

    /** SC | IM | IN | ORAL */
    @Column(name = "route_of_administration", length = 20)
    private String routeOfAdministration;

    /** e.g. "WSAVA VGG 2024" */
    @Column(name = "clinical_guideline_ref", columnDefinition = "TEXT")
    private String clinicalGuidelineRef;
}
