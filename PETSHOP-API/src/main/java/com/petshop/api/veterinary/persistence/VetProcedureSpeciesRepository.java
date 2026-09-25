package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetProcedureSpecies;
import com.petshop.api.entity.veterinary.VetProcedureSpeciesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VetProcedureSpeciesRepository extends JpaRepository<VetProcedureSpecies, VetProcedureSpeciesId> {

    List<VetProcedureSpecies> findByIdProcedureId(UUID procedureId);

    List<VetProcedureSpecies> findByIdPetTypeId(UUID petTypeId);
}
