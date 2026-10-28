package com.petshop.api.pet.persistence;

import com.petshop.api.entity.pet.PetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PetTypeRepository extends JpaRepository<PetType, UUID> {

    List<PetType> findByIsActiveTrueOrderBySortOrderAscNameAsc();
}
