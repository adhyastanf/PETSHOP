package com.petshop.api.merchant.persistence;

import com.petshop.api.entity.staff.MerchantStaffBranch;
import com.petshop.api.entity.staff.MerchantStaffBranchId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MerchantStaffBranchRepository extends JpaRepository<MerchantStaffBranch, MerchantStaffBranchId> {

    List<MerchantStaffBranch> findByStaff_Id(UUID staffId);

    void deleteByStaff_IdAndBranch_Id(UUID staffId, UUID branchId);

    boolean existsByStaff_IdAndBranch_Id(UUID staffId, UUID branchId);
}
