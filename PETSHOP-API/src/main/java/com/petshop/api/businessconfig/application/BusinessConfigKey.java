package com.petshop.api.businessconfig.application;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

/**
 * Registry of admin-manageable <b>business</b> configuration keys.
 *
 * <p>Each key is typed and range-constrained so that {@link BusinessConfigurationService}
 * can validate values and expose typed accessors. Only keys listed here are
 * editable through the admin business-configuration API.
 *
 * <p><b>Business configuration</b> (this enum) is distinct from
 * <b>technical/security configuration</b> (JWT, password hashing, CORS, datasource,
 * cryptography, idempotency, ledger immutability, transaction boundaries). The
 * latter live in {@code application.yml} / typed {@code @ConfigurationProperties}
 * (e.g. {@code AuthProperties}) and must NOT be exposed as editable business
 * configuration.
 */
public enum BusinessConfigKey {

    CHECKOUT_EXPIRATION_MINUTES(
            "checkout_expiration_minutes",
            ValueType.INTEGER,
            new BigDecimal("1"), new BigDecimal("1440"),
            false),

    SLOT_HOLD_DURATION_MINUTES(
            "slot_hold_duration_minutes",
            ValueType.INTEGER,
            new BigDecimal("1"), new BigDecimal("240"),
            false),

    MINIMUM_WITHDRAWAL_AMOUNT(
            "minimum_withdrawal_amount",
            ValueType.DECIMAL,
            new BigDecimal("0"), new BigDecimal("100000000"),
            false),

    DEFAULT_COMMISSION_PERCENTAGE(
            "default_commission_percentage",
            ValueType.DECIMAL,
            new BigDecimal("0"), new BigDecimal("100"),
            false),

    REVIEW_WINDOW_DAYS(
            "review_window_days",
            ValueType.INTEGER,
            new BigDecimal("1"), new BigDecimal("365"),
            true);

    /** Supported value types for business configuration. */
    public enum ValueType {
        INTEGER,
        DECIMAL,
        BOOLEAN
    }

    private final String key;
    private final ValueType valueType;
    private final BigDecimal min;
    private final BigDecimal max;
    private final boolean publicVisible;

    BusinessConfigKey(String key, ValueType valueType, BigDecimal min, BigDecimal max, boolean publicVisible) {
        this.key = key;
        this.valueType = valueType;
        this.min = min;
        this.max = max;
        this.publicVisible = publicVisible;
    }

    public String key() {
        return key;
    }

    public ValueType valueType() {
        return valueType;
    }

    /** Inclusive minimum for numeric keys; null for boolean. */
    public BigDecimal min() {
        return min;
    }

    /** Inclusive maximum for numeric keys; null for boolean. */
    public BigDecimal max() {
        return max;
    }

    /** Whether this key may be exposed to non-admin (public) consumers. */
    public boolean isPublicVisible() {
        return publicVisible;
    }

    public static Optional<BusinessConfigKey> fromKey(String key) {
        return Arrays.stream(values())
                .filter(k -> k.key.equals(key))
                .findFirst();
    }

    public static boolean isManaged(String key) {
        return fromKey(key).isPresent();
    }
}
