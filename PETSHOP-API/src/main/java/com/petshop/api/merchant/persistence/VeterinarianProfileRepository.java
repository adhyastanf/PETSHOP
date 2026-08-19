package com.petshop.api.merchant.persistence;

import com.petshop.api.entity.staff.VeterinarianProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VeterinarianProfileRepository extends JpaRepository<VeterinarianProfile, UUID> {

    Optional<VeterinarianProfile> findByStaffId(UUID staffId);
}
