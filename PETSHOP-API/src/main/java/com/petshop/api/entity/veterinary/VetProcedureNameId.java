package com.petshop.api.entity.veterinary;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

/** Composite primary key for {@link VetProcedureName}. */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class VetProcedureNameId implements Serializable {

    @Column(name = "procedure_id")
    private UUID procedureId;

    @Column(name = "language_code", length = 10)
    private String languageCode;
}
