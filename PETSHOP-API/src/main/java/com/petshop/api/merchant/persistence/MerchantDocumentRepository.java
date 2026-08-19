package com.petshop.api.merchant.persistence;

import com.petshop.api.entity.merchant.MerchantDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MerchantDocumentRepository extends JpaRepository<MerchantDocument, UUID> {

    List<MerchantDocument> findByMerchant_IdOrderByCreatedAtDesc(UUID merchantId);
}
