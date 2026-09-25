package com.petshop.api.entity.veterinary;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * An authoritative external source used as a provenance reference when
 * authoring veterinary concepts. Records metadata/citation information only —
 * no copyrighted source content is stored here.
 *
 * <p>source_type values: TERMINOLOGY | GUIDELINE | REFERENCE
 */
@Entity
@Table(name = "vet_source")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetSource extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "organization", nullable = false, length = 200)
    private String organization;

    /** TERMINOLOGY | GUIDELINE | REFERENCE */
    @Column(name = "source_type", nullable = false, length = 30)
    private String sourceType;

    @Column(name = "url", length = 500)
    private String url;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
