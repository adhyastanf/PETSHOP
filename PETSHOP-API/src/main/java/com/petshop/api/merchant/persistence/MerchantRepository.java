package com.petshop.api.merchant.persistence;

import com.petshop.api.entity.merchant.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, UUID> {

    Optional<Merchant> findByOwnerUser_IdAndDeletedAtIsNull(UUID ownerUserId);

    List<Merchant> findByOwnerUser_IdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID ownerUserId);

    boolean existsByOwnerUser_IdAndVerificationStatusInAndDeletedAtIsNull(UUID ownerUserId, List<String> statuses);

    Optional<Merchant> findByOwnerUser_IdAndVerificationStatusAndDeletedAtIsNull(UUID ownerUserId, String verificationStatus);

    List<Merchant> findByDeletedAtIsNullOrderByCreatedAtDesc();
}
