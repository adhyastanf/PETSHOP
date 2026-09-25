package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetConceptExternalMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VetConceptExternalMappingRepository extends JpaRepository<VetConceptExternalMapping, UUID> {

    List<VetConceptExternalMapping> findByConcept_Id(UUID conceptId);

    List<VetConceptExternalMapping> findBySystemCodeAndIsCurrent(String systemCode, boolean isCurrent);

    Optional<VetConceptExternalMapping> findByConcept_IdAndSystemCodeAndMatchType(
            UUID conceptId, String systemCode, String matchType);
}
