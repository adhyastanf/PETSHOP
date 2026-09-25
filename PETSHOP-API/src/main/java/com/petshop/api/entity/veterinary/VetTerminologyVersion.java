package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * A named, dated snapshot of the Oyen veterinary terminology.
 *
 * <p>Future patient medical records will store the version_code active at
 * recording time so that historical clinical meaning is preserved even after
 * the master is updated. Only one version may have is_current = TRUE.
 */
@Entity
@Table(name = "vet_terminology_version")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetTerminologyVersion extends BaseEntity {

    @Column(name = "version_code", nullable = false, unique = true, length = 50)
    private String versionCode;

    @Column(name = "published_at", nullable = false)
    private Instant publishedAt;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** Optional: e.g. "VetSCT RF2 2026-09" if this version imports from an external release. */
    @Column(name = "external_source_ref", length = 200)
    private String externalSourceRef;

    @Column(name = "is_current", nullable = false)
    private Boolean isCurrent;
}
