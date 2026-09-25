package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetConceptName;
import com.petshop.api.entity.veterinary.VetConceptNameId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VetConceptNameRepository extends JpaRepository<VetConceptName, VetConceptNameId> {

    List<VetConceptName> findByIdConceptId(UUID conceptId);

    boolean existsByIdConceptIdAndIdLanguageCode(UUID conceptId, String languageCode);
}
