package com.petshop.api.pet.persistence;

import com.petshop.api.entity.pet.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {

    List<Pet> findByOwnerUser_IdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID ownerUserId);

    Optional<Pet> findByIdAndOwnerUser_IdAndDeletedAtIsNull(UUID id, UUID ownerUserId);

    boolean existsByMicrochipNumber(String microchipNumber);

    boolean existsByMicrochipNumberAndIdNot(String microchipNumber, UUID id);
}
