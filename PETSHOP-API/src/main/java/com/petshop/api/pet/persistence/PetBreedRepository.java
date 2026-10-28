package com.petshop.api.pet.persistence;

import com.petshop.api.entity.pet.PetBreed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PetBreedRepository extends JpaRepository<PetBreed, UUID> {

    List<PetBreed> findByPetType_IdAndIsActiveTrueOrderByNameAsc(UUID petTypeId);
}
