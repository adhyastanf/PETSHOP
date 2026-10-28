package com.petshop.api.pet.persistence;

import com.petshop.api.entity.pet.VaccineType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VaccineTypeRepository extends JpaRepository<VaccineType, UUID> {
}
