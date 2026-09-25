package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Optional mapping from an Oyen {@link VetConcept} to an external terminology
 * code (e.g. a VetSCT/SNOMED SCTID, an ICD-10-vet code).
 *
 * <p>External codes are NEVER the primary key. Oyen's UUID is primary.
 * These mappings can be added, corrected, or removed without touching the
 * concept itself or any clinical records that reference it.
 *
 * <p>Storing VetSCT SCTIDs internally may require an IHTSDO Affiliate License
 * for commercial use in Indonesia. See VETERINARY_OPEN_DECISIONS.md OD-001.
 *
 * <p>system_code examples: "SNOMEDCT_VET", "ICD10_VET", "OYEN_LEGACY"
 *
 * <p>match_type values: EXACT | BROADER | NARROWER | RELATED
 */
@Entity
@Table(name = "vet_concept_external_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetConceptExternalMapping extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id", nullable = false)
    private VetConcept concept;

    /** Identifies the terminology system, e.g. "SNOMEDCT_VET", "ICD10_VET". */
    @Column(name = "system_code", nullable = false, length = 50)
    private String systemCode;

    /** Release/version of the external system, e.g. "2026-09". */
    @Column(name = "system_version", length = 50)
    private String systemVersion;

    /** The external identifier within the named system (e.g. SCTID). */
    @Column(name = "external_code", nullable = false, length = 255)
    private String externalCode;

    /** EXACT | BROADER | NARROWER | RELATED */
    @Column(name = "match_type", nullable = false, length = 20)
    private String matchType;

    @Column(name = "is_current", nullable = false)
    private Boolean isCurrent;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }
}
