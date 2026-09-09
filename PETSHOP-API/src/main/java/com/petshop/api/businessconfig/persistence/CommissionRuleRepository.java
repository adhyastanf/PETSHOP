package com.petshop.api.businessconfig.persistence;

import com.petshop.api.entity.finance.CommissionRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommissionRuleRepository extends JpaRepository<CommissionRule, UUID> {

    List<CommissionRule> findByOrderByPriorityDescValidFromDesc();

    List<CommissionRule> findByTransactionType(String transactionType);

    List<CommissionRule> findByIsActiveTrue();
}
