package com.petshop.api.veterinary.persistence;

import com.petshop.api.entity.veterinary.VetTerminologyVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VetTerminologyVersionRepository extends JpaRepository<VetTerminologyVersion, UUID> {

    Optional<VetTerminologyVersion> findByVersionCode(String versionCode);

    /** Returns the single current (active) terminology version, if one exists. */
    Optional<VetTerminologyVersion> findByIsCurrentTrue();
}
