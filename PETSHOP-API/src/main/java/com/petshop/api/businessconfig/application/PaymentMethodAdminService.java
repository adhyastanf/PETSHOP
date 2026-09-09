package com.petshop.api.businessconfig.application;

import com.petshop.api.businessconfig.api.dto.PaymentMethodResponse;
import com.petshop.api.businessconfig.application.exception.ConfigurationNotFoundException;
import com.petshop.api.businessconfig.persistence.PaymentMethodRepository;
import com.petshop.api.entity.payment.PaymentMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Administrative management of payment method <b>availability</b> only.
 *
 * <p>This deliberately does NOT implement payment processing or any Xendit API
 * integration — those belong to the Payment phase and use the existing
 * {@code PaymentProvider} abstraction. Here, admins can view methods and toggle
 * their active state; changes are audited.
 */
@Service
@Transactional
public class PaymentMethodAdminService {

    private static final String ENTITY_TYPE = "PaymentMethod";
    private static final String ACTION_STATUS = "PAYMENT_METHOD_STATUS_CHANGED";

    private final PaymentMethodRepository repository;
    private final ConfigAuditService auditService;

    public PaymentMethodAdminService(PaymentMethodRepository repository, ConfigAuditService auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<PaymentMethodResponse> list() {
        return repository.findByOrderBySortOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Enables or disables a payment method and records an audit entry. */
    public PaymentMethodResponse setActive(UUID id, boolean active, UUID actorUserId) {
        PaymentMethod method = repository.findById(id)
                .orElseThrow(() -> new ConfigurationNotFoundException("Payment method not found: " + id));
        boolean previous = Boolean.TRUE.equals(method.getIsActive());
        method.setIsActive(active);
        PaymentMethod saved = repository.save(method);
        auditService.record(actorUserId, ACTION_STATUS, ENTITY_TYPE, saved.getId(),
                "{\"isActive\":" + previous + "}", "{\"isActive\":" + active + "}");
        return toResponse(saved);
    }

    private PaymentMethodResponse toResponse(PaymentMethod method) {
        return new PaymentMethodResponse(
                method.getId(),
                method.getProviderCode(),
                method.getMethodCode(),
                method.getName(),
                method.getType(),
                Boolean.TRUE.equals(method.getIsActive()),
                method.getSortOrder()
        );
    }
}
