package com.petshop.api.businessconfig;

import com.petshop.api.businessconfig.application.CommissionConstants;
import com.petshop.api.businessconfig.application.CommissionRuleContext;
import com.petshop.api.businessconfig.application.CommissionRuleResolver;
import com.petshop.api.entity.finance.CommissionRule;
import com.petshop.api.entity.merchant.Merchant;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pure unit tests for the deterministic commission rule resolver.
 * No Spring context / database required.
 */
class CommissionRuleResolverTest {

    private final CommissionRuleResolver resolver = new CommissionRuleResolver();

    private CommissionRule rule(UUID id, String txType, Merchant merchant, UUID categoryId,
                                BigDecimal value, int priority, Instant from, Instant until, boolean active) {
        CommissionRule r = CommissionRule.builder()
                .merchant(merchant)
                .transactionType(txType)
                .categoryId(categoryId)
                .commissionType(CommissionConstants.TYPE_PERCENTAGE)
                .commissionValue(value)
                .priority(priority)
                .validFrom(from)
                .validUntil(until)
                .isActive(active)
                .build();
        r.setId(id);
        return r;
    }

    private Merchant merchant(UUID id) {
        Merchant m = Merchant.builder().build();
        m.setId(id);
        return m;
    }

    @Test
    void resolvesGlobalRuleWhenNoOverride() {
        CommissionRule global = rule(UUID.randomUUID(), "PRODUCT", null, null,
                new BigDecimal("4"), 0, null, null, true);

        Optional<CommissionRule> resolved = resolver.resolve(List.of(global),
                new CommissionRuleContext("PRODUCT", UUID.randomUUID(), UUID.randomUUID(), Instant.now()));

        assertThat(resolved).isPresent();
        assertThat(resolved.get().getCommissionValue()).isEqualByComparingTo("4");
    }

    @Test
    void merchantOverrideBeatsCategoryAndGlobal() {
        UUID merchantId = UUID.randomUUID();
        UUID categoryId = UUID.randomUUID();
        CommissionRule global = rule(UUID.randomUUID(), "SERVICE", null, null,
                new BigDecimal("4"), 0, null, null, true);
        CommissionRule category = rule(UUID.randomUUID(), "SERVICE", null, categoryId,
                new BigDecimal("5"), 0, null, null, true);
        CommissionRule merchantRule = rule(UUID.randomUUID(), "SERVICE", merchant(merchantId), null,
                new BigDecimal("3"), 0, null, null, true);

        Optional<CommissionRule> resolved = resolver.resolve(List.of(global, category, merchantRule),
                new CommissionRuleContext("SERVICE", merchantId, categoryId, Instant.now()));

        assertThat(resolved).isPresent();
        assertThat(resolved.get().getCommissionValue()).isEqualByComparingTo("3");
    }

    @Test
    void categoryOverrideBeatsGlobalWhenNoMerchantRule() {
        UUID categoryId = UUID.randomUUID();
        CommissionRule global = rule(UUID.randomUUID(), "SERVICE", null, null,
                new BigDecimal("4"), 0, null, null, true);
        CommissionRule category = rule(UUID.randomUUID(), "SERVICE", null, categoryId,
                new BigDecimal("5"), 0, null, null, true);

        Optional<CommissionRule> resolved = resolver.resolve(List.of(global, category),
                new CommissionRuleContext("SERVICE", UUID.randomUUID(), categoryId, Instant.now()));

        assertThat(resolved).isPresent();
        assertThat(resolved.get().getCommissionValue()).isEqualByComparingTo("5");
    }

    @Test
    void inactiveRuleIsIgnored() {
        CommissionRule inactive = rule(UUID.randomUUID(), "PRODUCT", null, null,
                new BigDecimal("9"), 100, null, null, false);

        Optional<CommissionRule> resolved = resolver.resolve(List.of(inactive),
                new CommissionRuleContext("PRODUCT", null, null, Instant.now()));

        assertThat(resolved).isEmpty();
    }

    @Test
    void effectiveDatingSelectsRuleActiveAtTimestamp() {
        Instant now = Instant.now();
        Instant sep = now.minus(40, ChronoUnit.DAYS);
        Instant oct = now.minus(10, ChronoUnit.DAYS);

        // 4% effective Sep 1 -> Oct 1; 5% effective Oct 1 -> open
        CommissionRule septRule = rule(UUID.randomUUID(), "PRODUCT", null, null,
                new BigDecimal("4"), 0, sep, oct, true);
        CommissionRule octRule = rule(UUID.randomUUID(), "PRODUCT", null, null,
                new BigDecimal("5"), 0, oct, null, true);

        // A transaction dated within September window keeps 4%
        Optional<CommissionRule> historical = resolver.resolve(List.of(septRule, octRule),
                new CommissionRuleContext("PRODUCT", null, null, sep.plus(5, ChronoUnit.DAYS)));
        assertThat(historical).isPresent();
        assertThat(historical.get().getCommissionValue()).isEqualByComparingTo("4");

        // A transaction dated now uses 5%
        Optional<CommissionRule> current = resolver.resolve(List.of(septRule, octRule),
                new CommissionRuleContext("PRODUCT", null, null, now));
        assertThat(current).isPresent();
        assertThat(current.get().getCommissionValue()).isEqualByComparingTo("5");
    }

    @Test
    void higherPriorityWinsWithinSameScope() {
        CommissionRule low = rule(UUID.randomUUID(), "PRODUCT", null, null,
                new BigDecimal("4"), 1, null, null, true);
        CommissionRule high = rule(UUID.randomUUID(), "PRODUCT", null, null,
                new BigDecimal("6"), 5, null, null, true);

        Optional<CommissionRule> resolved = resolver.resolve(List.of(low, high),
                new CommissionRuleContext("PRODUCT", null, null, Instant.now()));

        assertThat(resolved).isPresent();
        assertThat(resolved.get().getCommissionValue()).isEqualByComparingTo("6");
    }

    @Test
    void noApplicableRuleForDifferentTransactionType() {
        CommissionRule productRule = rule(UUID.randomUUID(), "PRODUCT", null, null,
                new BigDecimal("4"), 0, null, null, true);

        Optional<CommissionRule> resolved = resolver.resolve(List.of(productRule),
                new CommissionRuleContext("SERVICE", null, null, Instant.now()));

        assertThat(resolved).isEmpty();
    }
}
