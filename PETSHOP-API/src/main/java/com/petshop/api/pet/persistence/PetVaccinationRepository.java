package com.petshop.api.pet.persistence;

import com.petshop.api.entity.pet.PetVaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PetVaccinationRepository extends JpaRepository<PetVaccination, UUID> {

    List<PetVaccination> findByPet_IdOrderByVaccinationDateDescCreatedAtDesc(UUID petId);
}
