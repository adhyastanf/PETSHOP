package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VetSourceRepository extends JpaRepository<VetSource, UUID> {

    Optional<VetSource> findByCode(String code);

    List<VetSource> findByIsActiveTrueOrderByNameAsc();
}
