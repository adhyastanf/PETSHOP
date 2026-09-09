package com.petshop.api.businessconfig.application;

import java.util.Set;

/**
 * Canonical constants for commission rules. Kept in one place so the resolver,
 * validation, and admin service agree on the allowed vocabulary.
 */
public final class CommissionConstants {

    private CommissionConstants() {
    }

    public static final String TX_PRODUCT = "PRODUCT";
    public static final String TX_SERVICE = "SERVICE";
    public static final Set<String> TRANSACTION_TYPES = Set.of(TX_PRODUCT, TX_SERVICE);

    public static final String TYPE_PERCENTAGE = "PERCENTAGE";
    public static final String TYPE_FIXED = "FIXED";
    public static final Set<String> COMMISSION_TYPES = Set.of(TYPE_PERCENTAGE, TYPE_FIXED);

    public static final String SCOPE_GLOBAL = "GLOBAL";
    public static final String SCOPE_CATEGORY = "CATEGORY";
    public static final String SCOPE_MERCHANT = "MERCHANT";

    /**
     * Scope specificity used for deterministic resolution. Higher is more
     * specific: MERCHANT (3) &gt; CATEGORY (2) &gt; GLOBAL (1).
     */
    public static int scopeSpecificity(String scope) {
        return switch (scope) {
            case SCOPE_MERCHANT -> 3;
            case SCOPE_CATEGORY -> 2;
            case SCOPE_GLOBAL -> 1;
            default -> 0;
        };
    }
}
