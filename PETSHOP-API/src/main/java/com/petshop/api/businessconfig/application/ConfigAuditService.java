package com.petshop.api.businessconfig.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petshop.api.businessconfig.persistence.AuditLogRepository;
import com.petshop.api.entity.system.AuditLog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

/**
 * Writes immutable {@link AuditLog} entries for administrative changes to
 * business configuration (system configuration, commission rules, payment
 * methods).
 *
 * <p>This reuses the existing {@code audit_logs} foundation rather than
 * introducing a parallel audit subsystem. It never records secrets, tokens,
 * passwords, or API keys — only business configuration values.
 */
@Service
public class ConfigAuditService {

    private static final Logger log = LoggerFactory.getLogger(ConfigAuditService.class);

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public ConfigAuditService(AuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Records an administrative configuration change.
     *
     * @param actorUserId the admin performing the change (nullable for system actions)
     * @param action      a stable action code, e.g. {@code CONFIG_UPDATED}
     * @param entityType  the configuration entity type, e.g. {@code SystemConfiguration}
     * @param entityId    the affected entity id (nullable when keyed by config key)
     * @param oldValue    the previous value (serialized to JSON); nullable
     * @param newValue    the new value (serialized to JSON); nullable
     */
    public void record(UUID actorUserId,
                        String action,
                        String entityType,
                        UUID entityId,
                        Object oldValue,
                        Object newValue) {
        AuditLog entry = AuditLog.builder()
                .actorUserId(actorUserId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(toJson(oldValue))
                .newValue(toJson(newValue))
                .createdAt(Instant.now())
                .build();
        auditLogRepository.save(entry);
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof String s) {
            return s;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            log.warn("Failed to serialize audit value of type {}: {}", value.getClass(), e.getMessage());
            return String.valueOf(value);
        }
    }
}
