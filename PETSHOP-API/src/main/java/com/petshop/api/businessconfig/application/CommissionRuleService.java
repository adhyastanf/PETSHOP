package com.petshop.api.businessconfig.application;

import com.petshop.api.businessconfig.api.dto.CommissionRuleResponse;
import com.petshop.api.businessconfig.api.dto.CreateCommissionRuleRequest;
import com.petshop.api.businessconfig.api.dto.UpdateCommissionRuleRequest;
import com.petshop.api.businessconfig.application.exception.ConfigurationNotFoundException;
import com.petshop.api.businessconfig.application.exception.InvalidConfigurationException;
import com.petshop.api.businessconfig.persistence.CommissionRuleRepository;
import com.petshop.api.entity.finance.CommissionRule;
import com.petshop.api.entity.merchant.Merchant;
import com.petshop.api.merchant.persistence.MerchantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Administrative management and deterministic resolution of commission rules
 * backed by the existing {@code commission_rules} table.
 *
 * <p>This task implements rule <b>administration</b> and <b>resolution</b> only.
 * Consumption of the resolved rate (snapshotting onto orders/bookings/ledger) is
 * intentionally deferred to the Finance/Order/Payment phases. When those phases
 * are implemented, the resolved commission MUST be snapshotted onto the
 * transaction so later rule changes never retroactively alter historical
 * commission, ledger entries, COD accruals, or settlements.
 */
@Service
@Transactional
public class CommissionRuleService {

    private static final String ENTITY_TYPE = "CommissionRule";
    private static final String ACTION_CREATED = "COMMISSION_RULE_CREATED";
    private static final String ACTION_UPDATED = "COMMISSION_RULE_UPDATED";
    private static final String ACTION_STATUS = "COMMISSION_RULE_STATUS_CHANGED";
    private static final BigDecimal MAX_PERCENTAGE = new BigDecimal("100");

    private final CommissionRuleRepository ruleRepository;
    private final MerchantRepository merchantRepository;
    private final CommissionRuleResolver resolver;
    private final ConfigAuditService auditService;

    public CommissionRuleService(CommissionRuleRepository ruleRepository,
                                 MerchantRepository merchantRepository,
                                 CommissionRuleResolver resolver,
                                 ConfigAuditService auditService) {
        this.ruleRepository = ruleRepository;
        this.merchantRepository = merchantRepository;
        this.resolver = resolver;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<CommissionRuleResponse> list() {
        return ruleRepository.findByOrderByPriorityDescValidFromDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CommissionRuleResponse get(UUID id) {
        return toResponse(getRuleOrThrow(id));
    }

    public CommissionRuleResponse create(CreateCommissionRuleRequest request, UUID actorUserId) {
        String transactionType = normalizeTransactionType(request.transactionType());
        String commissionType = normalizeCommissionType(request.commissionType());
        validateValue(commissionType, request.commissionValue());
        validateDateRange(request.validFrom(), request.validUntil());

        Merchant merchant = resolveMerchant(request.merchantId());
        if (request.merchantId() != null && request.categoryId() != null) {
            throw new InvalidConfigurationException(
                    "A commission rule cannot target both a merchant and a category");
        }

        int priority = request.priority() != null ? request.priority() : 0;
        boolean active = request.isActive() == null || request.isActive();

        CommissionRule candidate = CommissionRule.builder()
                .merchant(merchant)
                .transactionType(transactionType)
                .categoryId(request.categoryId())
                .commissionType(commissionType)
                .commissionValue(request.commissionValue())
                .priority(priority)
                .validFrom(request.validFrom())
                .validUntil(request.validUntil())
                .isActive(active)
                .build();

        if (active) {
            ensureNoConflict(candidate, null);
        }

        CommissionRule saved = ruleRepository.save(candidate);
        auditService.record(actorUserId, ACTION_CREATED, ENTITY_TYPE, saved.getId(), null, toResponse(saved));
        return toResponse(saved);
    }

    public CommissionRuleResponse update(UUID id, UpdateCommissionRuleRequest request, UUID actorUserId) {
        CommissionRule rule = getRuleOrThrow(id);
        CommissionRuleResponse before = toResponse(rule);

        if (request.transactionType() != null) {
            rule.setTransactionType(normalizeTransactionType(request.transactionType()));
        }
        if (request.commissionType() != null) {
            rule.setCommissionType(normalizeCommissionType(request.commissionType()));
        }
        if (request.commissionValue() != null) {
            rule.setCommissionValue(request.commissionValue());
        }
        if (request.merchantId() != null) {
            rule.setMerchant(resolveMerchant(request.merchantId()));
        }
        if (request.categoryId() != null) {
            rule.setCategoryId(request.categoryId());
        }
        if (request.priority() != null) {
            rule.setPriority(request.priority());
        }
        if (request.validFrom() != null) {
            rule.setValidFrom(request.validFrom());
        }
        if (request.validUntil() != null) {
            rule.setValidUntil(request.validUntil());
        }
        if (request.isActive() != null) {
            rule.setIsActive(request.isActive());
        }

        // Re-validate the resulting state.
        validateValue(rule.getCommissionType(), rule.getCommissionValue());
        validateDateRange(rule.getValidFrom(), rule.getValidUntil());
        if (rule.getMerchant() != null && rule.getCategoryId() != null) {
            throw new InvalidConfigurationException(
                    "A commission rule cannot target both a merchant and a category");
        }
        if (Boolean.TRUE.equals(rule.getIsActive())) {
            ensureNoConflict(rule, rule.getId());
        }

        CommissionRule saved = ruleRepository.save(rule);
        auditService.record(actorUserId, ACTION_UPDATED, ENTITY_TYPE, saved.getId(), before, toResponse(saved));
        return toResponse(saved);
    }

    public CommissionRuleResponse setActive(UUID id, boolean active, UUID actorUserId) {
        CommissionRule rule = getRuleOrThrow(id);
        CommissionRuleResponse before = toResponse(rule);
        if (active && !Boolean.TRUE.equals(rule.getIsActive())) {
            ensureNoConflict(rule, rule.getId());
        }
        rule.setIsActive(active);
        CommissionRule saved = ruleRepository.save(rule);
        auditService.record(actorUserId, ACTION_STATUS, ENTITY_TYPE, saved.getId(), before, toResponse(saved));
        return toResponse(saved);
    }

    /**
     * Resolves the applicable commission rule for the given context using the
     * deterministic {@link CommissionRuleResolver}. Reusable by future phases.
     */
    @Transactional(readOnly = true)
    public Optional<CommissionRule> resolveApplicable(CommissionRuleContext context) {
        return resolver.resolve(ruleRepository.findByIsActiveTrue(), context);
    }

    // ===== Validation helpers =====

    private String normalizeTransactionType(String value) {
        String normalized = value == null ? null : value.trim().toUpperCase();
        if (!CommissionConstants.TRANSACTION_TYPES.contains(normalized)) {
            throw new InvalidConfigurationException(
                    "transactionType must be one of " + CommissionConstants.TRANSACTION_TYPES);
        }
        return normalized;
    }

    private String normalizeCommissionType(String value) {
        String normalized = value == null ? null : value.trim().toUpperCase();
        if (!CommissionConstants.COMMISSION_TYPES.contains(normalized)) {
            throw new InvalidConfigurationException(
                    "commissionType must be one of " + CommissionConstants.COMMISSION_TYPES);
        }
        return normalized;
    }

    private void validateValue(String commissionType, BigDecimal value) {
        if (value == null) {
            throw new InvalidConfigurationException("commissionValue is required");
        }
        if (value.signum() < 0) {
            throw new InvalidConfigurationException("commissionValue cannot be negative");
        }
        if (CommissionConstants.TYPE_PERCENTAGE.equals(commissionType)
                && value.compareTo(MAX_PERCENTAGE) > 0) {
            throw new InvalidConfigurationException("Percentage commission cannot exceed 100");
        }
    }

    private void validateDateRange(Instant validFrom, Instant validUntil) {
        if (validFrom != null && validUntil != null && !validUntil.isAfter(validFrom)) {
            throw new InvalidConfigurationException("validUntil must be after validFrom");
        }
    }

    private Merchant resolveMerchant(UUID merchantId) {
        if (merchantId == null) {
            return null;
        }
        return merchantRepository.findById(merchantId)
                .orElseThrow(() -> new InvalidConfigurationException("Merchant not found: " + merchantId));
    }

    /**
     * Rejects a rule that would overlap another active rule with the same
     * transaction type, same scope, same target, same priority, and overlapping
     * effective window — which would otherwise create an ambiguous resolution.
     */
    private void ensureNoConflict(CommissionRule candidate, UUID excludeId) {
        String candidateScope = resolver.deriveScope(candidate);
        for (CommissionRule existing : ruleRepository.findByTransactionType(candidate.getTransactionType())) {
            if (!Boolean.TRUE.equals(existing.getIsActive())) {
                continue;
            }
            if (excludeId != null && excludeId.equals(existing.getId())) {
                continue;
            }
            if (!resolver.deriveScope(existing).equals(candidateScope)) {
                continue;
            }
            if (!sameTarget(existing, candidate, candidateScope)) {
                continue;
            }
            int candidatePriority = candidate.getPriority() != null ? candidate.getPriority() : 0;
            int existingPriority = existing.getPriority() != null ? existing.getPriority() : 0;
            if (candidatePriority != existingPriority) {
                continue;
            }
            if (windowsOverlap(existing, candidate)) {
                throw new InvalidConfigurationException(
                        "Conflicting active commission rule with the same scope, priority, and overlapping "
                                + "effective period already exists (id=" + existing.getId() + ")");
            }
        }
    }

    private boolean sameTarget(CommissionRule a, CommissionRule b, String scope) {
        return switch (scope) {
            case CommissionConstants.SCOPE_MERCHANT -> {
                UUID am = a.getMerchant() != null ? a.getMerchant().getId() : null;
                UUID bm = b.getMerchant() != null ? b.getMerchant().getId() : null;
                yield am != null && am.equals(bm);
            }
            case CommissionConstants.SCOPE_CATEGORY ->
                    a.getCategoryId() != null && a.getCategoryId().equals(b.getCategoryId());
            case CommissionConstants.SCOPE_GLOBAL -> true;
            default -> false;
        };
    }

    private boolean windowsOverlap(CommissionRule a, CommissionRule b) {
        Instant aStart = a.getValidFrom() != null ? a.getValidFrom() : Instant.MIN;
        Instant aEnd = a.getValidUntil() != null ? a.getValidUntil() : Instant.MAX;
        Instant bStart = b.getValidFrom() != null ? b.getValidFrom() : Instant.MIN;
        Instant bEnd = b.getValidUntil() != null ? b.getValidUntil() : Instant.MAX;
        // [start, end) half-open overlap test
        return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
    }

    private CommissionRule getRuleOrThrow(UUID id) {
        return ruleRepository.findById(id)
                .orElseThrow(() -> new ConfigurationNotFoundException("Commission rule not found: " + id));
    }

    private CommissionRuleResponse toResponse(CommissionRule rule) {
        return new CommissionRuleResponse(
                rule.getId(),
                rule.getTransactionType(),
                resolver.deriveScope(rule),
                rule.getMerchant() != null ? rule.getMerchant().getId() : null,
                rule.getCategoryId(),
                rule.getCommissionType(),
                rule.getCommissionValue(),
                rule.getPriority(),
                rule.getValidFrom(),
                rule.getValidUntil(),
                rule.getIsActive()
        );
    }
}
