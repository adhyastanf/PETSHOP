package com.petshop.api.merchant.persistence;

import com.petshop.api.entity.merchant.MerchantVerificationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MerchantVerificationHistoryRepository extends JpaRepository<MerchantVerificationHistory, UUID> {

    List<MerchantVerificationHistory> findByMerchant_IdOrderByCreatedAtDesc(UUID merchantId);
}
