package com.petshop.api.businessconfig.persistence;

import com.petshop.api.entity.payment.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, UUID> {

    List<PaymentMethod> findByOrderBySortOrderAsc();
}
