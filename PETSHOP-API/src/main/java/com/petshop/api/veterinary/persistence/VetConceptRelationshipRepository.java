package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetConceptRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VetConceptRelationshipRepository extends JpaRepository<VetConceptRelationship, UUID> {

    List<VetConceptRelationship> findByChildConcept_Id(UUID childConceptId);

    List<VetConceptRelationship> findByParentConcept_Id(UUID parentConceptId);

    Optional<VetConceptRelationship> findByChildConcept_IdAndIsPrimaryParentTrue(UUID childConceptId);

    boolean existsByChildConcept_IdAndParentConcept_Id(UUID childConceptId, UUID parentConceptId);
}
