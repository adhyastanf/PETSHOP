package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetConcept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VetConceptRepository extends JpaRepository<VetConcept, UUID> {

    Optional<VetConcept> findByCanonicalCode(String canonicalCode);

    boolean existsByCanonicalCode(String canonicalCode);

    List<VetConcept> findByStatusOrderByCanonicalCodeAsc(String status);

    List<VetConcept> findByConceptTypeAndStatusOrderByCanonicalCodeAsc(String conceptType, String status);
}
