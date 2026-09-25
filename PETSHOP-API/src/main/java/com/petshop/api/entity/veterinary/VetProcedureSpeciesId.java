package com.petshop.api.entity.veterinary;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

/** Composite primary key for {@link VetProcedureSpecies}. */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class VetProcedureSpeciesId implements Serializable {

    @Column(name = "procedure_id")
    private UUID procedureId;

    @Column(name = "pet_type_id")
    private UUID petTypeId;
}
