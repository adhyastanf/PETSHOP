package com.petshop.api.merchant.persistence;

import com.petshop.api.entity.merchant.MerchantBusinessHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MerchantBusinessHoursRepository extends JpaRepository<MerchantBusinessHour, UUID> {

    List<MerchantBusinessHour> findByBranch_IdOrderByDayOfWeekAsc(UUID branchId);

    void deleteByBranch_Id(UUID branchId);
}
