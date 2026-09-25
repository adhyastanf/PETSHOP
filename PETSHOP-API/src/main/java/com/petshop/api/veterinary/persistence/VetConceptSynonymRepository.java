package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetConceptSynonym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VetConceptSynonymRepository extends JpaRepository<VetConceptSynonym, UUID> {

    List<VetConceptSynonym> findByConcept_IdOrderByLanguageCodeAsc(UUID conceptId);

    List<VetConceptSynonym> findByConcept_IdAndLanguageCode(UUID conceptId, String languageCode);
}
