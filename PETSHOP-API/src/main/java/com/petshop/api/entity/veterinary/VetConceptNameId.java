package com.petshop.api.entity.veterinary;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

/** Composite primary key for {@link VetConceptName}. */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class VetConceptNameId implements Serializable {

    @Column(name = "concept_id")
    private UUID conceptId;

    @Column(name = "language_code", length = 10)
    private String languageCode;
}
