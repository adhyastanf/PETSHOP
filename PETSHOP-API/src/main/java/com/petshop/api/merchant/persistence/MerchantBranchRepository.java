package com.petshop.api.merchant.persistence;

import com.petshop.api.entity.merchant.MerchantBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MerchantBranchRepository extends JpaRepository<MerchantBranch, UUID> {

    List<MerchantBranch> findByMerchant_IdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID merchantId);

    Optional<MerchantBranch> findByIdAndDeletedAtIsNull(UUID id);

    boolean existsByMerchant_IdAndCodeAndDeletedAtIsNull(UUID merchantId, String code);

    long countByMerchant_IdAndDeletedAtIsNull(UUID merchantId);
}
