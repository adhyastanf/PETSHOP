package com.petshop.api.customer.persistence;

import com.petshop.api.entity.customer.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {

    List<Address> findByUser_IdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID userId);

    Optional<Address> findByIdAndUser_IdAndDeletedAtIsNull(UUID id, UUID userId);

    boolean existsByUser_IdAndDeletedAtIsNull(UUID userId);

    @Modifying
    @Query("""
            update Address a
            set a.isDefault = false
            where a.user.id = :userId
              and a.deletedAt is null
              and (:exceptId is null or a.id <> :exceptId)
            """)
    void clearDefaultForUser(@Param("userId") UUID userId, @Param("exceptId") UUID exceptId);
}
