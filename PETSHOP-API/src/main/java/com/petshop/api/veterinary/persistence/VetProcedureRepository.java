package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetProcedure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VetProcedureRepository extends JpaRepository<VetProcedure, UUID> {

    Optional<VetProcedure> findByCanonicalCode(String canonicalCode);

    boolean existsByCanonicalCode(String canonicalCode);

    List<VetProcedure> findByStatusOrderByCanonicalCodeAsc(String status);

    List<VetProcedure> findByProcedureCategoryAndStatusOrderByCanonicalCodeAsc(String category, String status);
}
