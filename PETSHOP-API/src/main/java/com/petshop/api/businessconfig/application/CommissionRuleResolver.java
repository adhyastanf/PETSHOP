package com.petshop.api.businessconfig.application;

import com.petshop.api.entity.finance.CommissionRule;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Pure, deterministic resolver that selects the single applicable
 * {@link CommissionRule} for a given {@link CommissionRuleContext}.
 *
 * <p>This is reusable domain logic with no dependency on future Order/Payment/
 * Settlement services. Those phases will call {@code resolve(...)} and then
 * <b>snapshot</b> the resolved rate onto the transaction's financial record.
 *
 * <p>Resolution policy (deterministic):
 * <ol>
 *   <li>Filter to active rules whose transactionType matches.</li>
 *   <li>Filter to rules effective at {@code context.at()} (validFrom inclusive,
 *       validUntil exclusive; null = open-ended).</li>
 *   <li>Filter to rules whose scope <i>applies</i> to the context: a MERCHANT
 *       rule must match the merchant; a CATEGORY rule must match the category;
 *       a GLOBAL rule always applies.</li>
 *   <li>Order by scope specificity (MERCHANT &gt; CATEGORY &gt; GLOBAL), then by
 *       priority (higher first), then by validFrom (later first), then by id
 *       (stable tie-breaker). The first rule wins.</li>
 * </ol>
 * The final id tie-breaker guarantees determinism even if administrative
 * validation is bypassed; overlapping same-specificity/same-priority rules are
 * additionally prevented at creation time by the service layer.
 */
@Component
public class CommissionRuleResolver {

    /**
     * Resolves the applicable rule from the supplied candidate list.
     * The caller provides candidates (typically all active rules) so this method
     * stays free of persistence concerns and is trivially unit-testable.
     */
    public Optional<CommissionRule> resolve(List<CommissionRule> candidates, CommissionRuleContext context) {
        Instant at = context.at() != null ? context.at() : Instant.now();
        return candidates.stream()
                .filter(rule -> Boolean.TRUE.equals(rule.getIsActive()))
                .filter(rule -> matchesTransactionType(rule, context.transactionType()))
                .filter(rule -> isEffectiveAt(rule, at))
                .filter(rule -> scopeApplies(rule, context))
                .max(comparator());
    }

    private Comparator<CommissionRule> comparator() {
        return Comparator
                .comparingInt((CommissionRule r) -> CommissionConstants.scopeSpecificity(deriveScope(r)))
                .thenComparingInt(r -> r.getPriority() != null ? r.getPriority() : 0)
                .thenComparing(r -> r.getValidFrom() != null ? r.getValidFrom() : Instant.EPOCH)
                .thenComparing(CommissionRule::getId);
    }

    private boolean matchesTransactionType(CommissionRule rule, String transactionType) {
        return rule.getTransactionType() != null
                && rule.getTransactionType().equalsIgnoreCase(transactionType);
    }

    private boolean isEffectiveAt(CommissionRule rule, Instant at) {
        boolean afterStart = rule.getValidFrom() == null || !at.isBefore(rule.getValidFrom());
        boolean beforeEnd = rule.getValidUntil() == null || at.isBefore(rule.getValidUntil());
        return afterStart && beforeEnd;
    }

    private boolean scopeApplies(CommissionRule rule, CommissionRuleContext context) {
        String scope = deriveScope(rule);
        return switch (scope) {
            case CommissionConstants.SCOPE_MERCHANT ->
                    context.merchantId() != null
                            && rule.getMerchant() != null
                            && rule.getMerchant().getId().equals(context.merchantId());
            case CommissionConstants.SCOPE_CATEGORY ->
                    context.categoryId() != null
                            && rule.getCategoryId() != null
                            && rule.getCategoryId().equals(context.categoryId());
            case CommissionConstants.SCOPE_GLOBAL -> true;
            default -> false;
        };
    }

    /**
     * Derives the scope of a rule from its populated targeting fields:
     * merchant present =&gt; MERCHANT; else category present =&gt; CATEGORY; else GLOBAL.
     */
    public String deriveScope(CommissionRule rule) {
        UUID merchantId = rule.getMerchant() != null ? rule.getMerchant().getId() : null;
        if (merchantId != null) {
            return CommissionConstants.SCOPE_MERCHANT;
        }
        if (rule.getCategoryId() != null) {
            return CommissionConstants.SCOPE_CATEGORY;
        }
        return CommissionConstants.SCOPE_GLOBAL;
    }
}
