package com.petshop.api.entity.veterinary;

import jakarta.persistence.*;
import lombok.*;

/**
 * Canonical display name for a {@link VetProcedure} in one language.
 * One row per procedure per language.
 */
@Entity
@Table(name = "vet_procedure_name")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetProcedureName {

    @EmbeddedId
    private VetProcedureNameId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("procedureId")
    @JoinColumn(name = "procedure_id")
    private VetProcedure procedure;

    @Column(name = "name", nullable = false, columnDefinition = "TEXT")
    private String name;
}
