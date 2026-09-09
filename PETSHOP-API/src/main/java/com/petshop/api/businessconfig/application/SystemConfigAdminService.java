package com.petshop.api.businessconfig.application;

import com.petshop.api.businessconfig.api.dto.SystemConfigResponse;
import com.petshop.api.businessconfig.application.exception.ConfigurationNotFoundException;
import com.petshop.api.businessconfig.persistence.SystemConfigurationRepository;
import com.petshop.api.entity.system.SystemConfiguration;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Admin-facing management of whitelisted business configuration keys.
 *
 * <p>Only keys declared in {@link BusinessConfigKey} are listed or editable.
 * Any other rows in {@code system_configurations} (or technical settings) are
 * intentionally not exposed here. All updates delegate to
 * {@link BusinessConfigurationService#updateValue} (validation + cache eviction)
 * and are audited via {@link ConfigAuditService}.
 */
@Service
public class SystemConfigAdminService {

    private static final String ENTITY_TYPE = "SystemConfiguration";
    private static final String ACTION_UPDATED = "BUSINESS_CONFIG_UPDATED";

    private final SystemConfigurationRepository repository;
    private final BusinessConfigurationService businessConfigurationService;
    private final ConfigAuditService auditService;

    public SystemConfigAdminService(SystemConfigurationRepository repository,
                                    BusinessConfigurationService businessConfigurationService,
                                    ConfigAuditService auditService) {
        this.repository = repository;
        this.businessConfigurationService = businessConfigurationService;
        this.auditService = auditService;
    }

    /** Lists all managed business configuration entries. */
    @Transactional(readOnly = true)
    public List<SystemConfigResponse> listManaged() {
        return java.util.Arrays.stream(BusinessConfigKey.values())
                .map(this::toResponse)
                .toList();
    }

    /** Returns a single managed configuration entry. */
    @Transactional(readOnly = true)
    public SystemConfigResponse get(String key) {
        BusinessConfigKey managedKey = BusinessConfigKey.fromKey(key)
                .orElseThrow(() -> new ConfigurationNotFoundException(
                        "Unknown or non-editable business configuration key: " + key));
        return toResponse(managedKey);
    }

    /**
     * Updates a managed configuration value, records an audit entry, and returns
     * the updated view.
     */
    @Transactional
    public SystemConfigResponse update(String key, String value, UUID actorUserId) {
        String previous = businessConfigurationService.updateValue(key, value, actorUserId);
        auditService.record(actorUserId, ACTION_UPDATED, ENTITY_TYPE, null, previous,
                repository.findByConfigKey(key).map(SystemConfiguration::getConfigValue).orElse(null));
        return get(key);
    }

    private SystemConfigResponse toResponse(BusinessConfigKey key) {
        Optional<SystemConfiguration> configOpt = repository.findByConfigKey(key.key());
        String rawValue = configOpt.map(SystemConfiguration::getConfigValue).orElse(null);
        String description = configOpt.map(SystemConfiguration::getDescription).orElse(null);
        Boolean isPublic = configOpt.map(SystemConfiguration::getIsPublic).orElse(key.isPublicVisible());
        return new SystemConfigResponse(
                key.key(),
                extractValueText(rawValue),
                key.valueType().name(),
                description,
                key.min() != null ? key.min().toPlainString() : null,
                key.max() != null ? key.max().toPlainString() : null,
                Boolean.TRUE.equals(isPublic),
                configOpt.map(SystemConfiguration::getUpdatedAt).orElse(null)
        );
    }

    private String extractValueText(String rawJson) {
        if (rawJson == null) {
            return null;
        }
        // config_value is stored as {"value": X}; surface just the scalar as text.
        String trimmed = rawJson.trim();
        int idx = trimmed.indexOf(':');
        int end = trimmed.lastIndexOf('}');
        if (idx >= 0 && end > idx) {
            return trimmed.substring(idx + 1, end).replace("\"", "").trim();
        }
        return trimmed;
    }
}
