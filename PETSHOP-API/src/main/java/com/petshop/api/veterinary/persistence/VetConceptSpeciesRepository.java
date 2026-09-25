package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetConceptSpecies;
import com.petshop.api.entity.veterinary.VetConceptSpeciesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VetConceptSpeciesRepository extends JpaRepository<VetConceptSpecies, VetConceptSpeciesId> {

    List<VetConceptSpecies> findByIdConceptId(UUID conceptId);

    /** Returns all concepts linked to a given species (pet_type). */
    List<VetConceptSpecies> findByIdPetTypeId(UUID petTypeId);
}
