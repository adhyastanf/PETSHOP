package com.petshop.api.merchant.persistence;

import com.petshop.api.entity.staff.MerchantStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MerchantStaffRepository extends JpaRepository<MerchantStaff, UUID> {

    List<MerchantStaff> findByMerchant_IdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID merchantId);

    List<MerchantStaff> findByRole_CodeAndDeletedAtIsNullOrderByCreatedAtDesc(String roleCode);

    Optional<MerchantStaff> findByIdAndDeletedAtIsNull(UUID id);

    boolean existsByMerchant_IdAndUser_IdAndDeletedAtIsNull(UUID merchantId, UUID userId);

    Optional<MerchantStaff> findFirstByUser_IdAndDeletedAtIsNull(UUID userId);
}
