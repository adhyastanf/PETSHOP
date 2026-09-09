package com.petshop.api.businessconfig.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.petshop.api.businessconfig.application.exception.ConfigurationNotFoundException;
import com.petshop.api.businessconfig.application.exception.InvalidConfigurationException;
import com.petshop.api.businessconfig.persistence.SystemConfigurationRepository;
import com.petshop.api.entity.system.SystemConfiguration;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

/**
 * Canonical, authoritative access point for system-level <b>business</b>
 * configuration backed by the {@code system_configurations} table.
 *
 * <p>Future business services (Checkout, Order, Payment, Booking, Settlement,
 * etc.) MUST read configurable business values through this service rather than
 * hardcoding constants or querying {@link SystemConfigurationRepository}
 * directly. Example:
 * <pre>{@code
 *   Duration expiry = businessConfigurationService.getCheckoutExpiration();
 * }</pre>
 *
 * <p>Reads are cached via Spring Cache (cache name {@code businessConfig}).
 * Administrative writes go through {@link #updateValue} which validates the
 * value, updates transactionally, and evicts the cache so subsequent reads see
 * the new value. Missing configuration falls back to the documented default.
 *
 * <p>This service handles ONLY business configuration. Technical/security
 * settings (JWT, password hashing, datasource, CORS, cryptography) are not
 * managed here.
 */
@Service
public class BusinessConfigurationService {

    public static final String CACHE_NAME = "businessConfig";

    private final SystemConfigurationRepository repository;
    private final ObjectMapper objectMapper;

    public BusinessConfigurationService(SystemConfigurationRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    // ===== Typed convenience accessors (canonical future-phase entry points) =====

    /** Minutes before an unpaid checkout expires. Consumed by future CheckoutService. */
    public Duration getCheckoutExpiration() {
        return Duration.ofMinutes(getInteger(BusinessConfigKey.CHECKOUT_EXPIRATION_MINUTES, 30));
    }

    /** Minutes a service slot hold remains active. Consumed by future scheduling/checkout. */
    public Duration getSlotHoldDuration() {
        return Duration.ofMinutes(getInteger(BusinessConfigKey.SLOT_HOLD_DURATION_MINUTES, 15));
    }

    /** Minimum withdrawal amount (IDR). Consumed by future WithdrawalService. */
    public BigDecimal getMinimumWithdrawalAmount() {
        return getDecimal(BusinessConfigKey.MINIMUM_WITHDRAWAL_AMOUNT, new BigDecimal("50000"));
    }

    /**
     * Default platform commission percentage used only as a fallback when no
     * applicable {@code commission_rules} row matches. The authoritative source
     * for commission is the commission-rule resolver.
     */
    public BigDecimal getDefaultCommissionPercentage() {
        return getDecimal(BusinessConfigKey.DEFAULT_COMMISSION_PERCENTAGE, new BigDecimal("4"));
    }

    /** Days after completion during which a review may be submitted. */
    public int getReviewWindowDays() {
        return getInteger(BusinessConfigKey.REVIEW_WINDOW_DAYS, 14);
    }

    // ===== Generic typed getters =====

    /**
     * Returns the integer value for a managed key, or {@code defaultValue} when
     * the key is not present in the database.
     */
    public int getInteger(BusinessConfigKey key, int defaultValue) {
        if (key.valueType() != BusinessConfigKey.ValueType.INTEGER) {
            throw new InvalidConfigurationException("Config key is not an integer: " + key.key());
        }
        return readValueNode(key.key())
                .map(node -> node.asInt())
                .orElse(defaultValue);
    }

    /**
     * Returns the decimal value for a managed key, or {@code defaultValue} when
     * the key is not present in the database.
     */
    public BigDecimal getDecimal(BusinessConfigKey key, BigDecimal defaultValue) {
        if (key.valueType() != BusinessConfigKey.ValueType.DECIMAL) {
            throw new InvalidConfigurationException("Config key is not a decimal: " + key.key());
        }
        return readValueNode(key.key())
                .map(node -> new BigDecimal(node.asText()))
                .orElse(defaultValue);
    }

    /**
     * Returns the boolean value for a managed key, or {@code defaultValue} when
     * the key is not present in the database.
     */
    public boolean getBoolean(BusinessConfigKey key, boolean defaultValue) {
        if (key.valueType() != BusinessConfigKey.ValueType.BOOLEAN) {
            throw new InvalidConfigurationException("Config key is not a boolean: " + key.key());
        }
        return readValueNode(key.key())
                .map(JsonNode::asBoolean)
                .orElse(defaultValue);
    }

    /**
     * Reads the raw string value for a managed key. Cached per key.
     * Returns the stored {@code config_value} JSON, or empty when absent.
     */
    @Cacheable(cacheNames = CACHE_NAME, key = "#configKey")
    public Optional<String> getRawConfigValue(String configKey) {
        return repository.findByConfigKey(configKey).map(SystemConfiguration::getConfigValue);
    }

    private Optional<JsonNode> readValueNode(String configKey) {
        return getRawConfigValue(configKey).map(this::parseValueNode);
    }

    private JsonNode parseValueNode(String rawJson) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode value = root.get("value");
            if (value == null) {
                throw new InvalidConfigurationException("Config value JSON missing 'value' field: " + rawJson);
            }
            return value;
        } catch (InvalidConfigurationException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidConfigurationException("Malformed config value JSON: " + rawJson);
        }
    }

    // ===== Administrative update (validated, transactional, cache-evicting) =====

    /**
     * Validates and persists a new value for a managed business configuration key.
     * Evicts the cache entry so subsequent reads observe the new value.
     *
     * @return the previous raw JSON value (for audit), or null if the key was newly created
     * @throws ConfigurationNotFoundException if the key is not a managed business key
     * @throws InvalidConfigurationException  if the value fails type/range validation
     */
    @Transactional
    @CacheEvict(cacheNames = CACHE_NAME, key = "#configKey")
    public String updateValue(String configKey, String rawValue, UUID actorUserId) {
        BusinessConfigKey managedKey = BusinessConfigKey.fromKey(configKey)
                .orElseThrow(() -> new ConfigurationNotFoundException(
                        "Unknown or non-editable business configuration key: " + configKey));

        String normalizedJson = validateAndNormalize(managedKey, rawValue);

        SystemConfiguration config = repository.findByConfigKey(configKey)
                .orElseThrow(() -> new ConfigurationNotFoundException(
                        "Configuration key not present in database: " + configKey));

        String previous = config.getConfigValue();
        config.setConfigValue(normalizedJson);
        config.setUpdatedBy(actorUserId);
        config.setUpdatedAt(java.time.Instant.now());
        repository.save(config);
        return previous;
    }

    /**
     * Validates a candidate value against a managed key and returns the
     * normalized {@code {"value": ...}} JSON to store.
     */
    public String validateAndNormalize(BusinessConfigKey key, String rawValue) {
        if (rawValue == null || rawValue.isBlank()) {
            throw new InvalidConfigurationException("Value is required for " + key.key());
        }
        ObjectNode node = objectMapper.createObjectNode();
        switch (key.valueType()) {
            case INTEGER -> {
                long parsed = parseLong(key, rawValue);
                validateRange(key, new BigDecimal(parsed));
                node.put("value", parsed);
            }
            case DECIMAL -> {
                BigDecimal parsed = parseDecimal(key, rawValue);
                validateRange(key, parsed);
                node.put("value", parsed);
            }
            case BOOLEAN -> {
                if (!"true".equalsIgnoreCase(rawValue) && !"false".equalsIgnoreCase(rawValue)) {
                    throw new InvalidConfigurationException("Value for " + key.key() + " must be true or false");
                }
                node.put("value", Boolean.parseBoolean(rawValue));
            }
        }
        return node.toString();
    }

    private long parseLong(BusinessConfigKey key, String rawValue) {
        try {
            return Long.parseLong(rawValue.trim());
        } catch (NumberFormatException e) {
            throw new InvalidConfigurationException("Value for " + key.key() + " must be an integer");
        }
    }

    private BigDecimal parseDecimal(BusinessConfigKey key, String rawValue) {
        try {
            return new BigDecimal(rawValue.trim());
        } catch (NumberFormatException e) {
            throw new InvalidConfigurationException("Value for " + key.key() + " must be a number");
        }
    }

    private void validateRange(BusinessConfigKey key, BigDecimal value) {
        if (key.min() != null && value.compareTo(key.min()) < 0) {
            throw new InvalidConfigurationException(
                    "Value for " + key.key() + " must be >= " + key.min().toPlainString());
        }
        if (key.max() != null && value.compareTo(key.max()) > 0) {
            throw new InvalidConfigurationException(
                    "Value for " + key.key() + " must be <= " + key.max().toPlainString());
        }
    }
}
