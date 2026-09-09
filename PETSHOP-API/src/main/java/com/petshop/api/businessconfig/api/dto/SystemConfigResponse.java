package com.petshop.api.businessconfig.api.dto;

import java.time.Instant;

/**
 * Admin-facing view of a single managed business configuration entry.
 *
 * @param key         the configuration key
 * @param value       the current raw value (as text)
 * @param valueType   INTEGER | DECIMAL | BOOLEAN
 * @param description human-readable description
 * @param min         inclusive minimum (numeric keys), nullable
 * @param max         inclusive maximum (numeric keys), nullable
 * @param isPublic    whether the value may be exposed to non-admin consumers
 * @param updatedAt   last update timestamp, nullable
 */
public record SystemConfigResponse(
        String key,
        String value,
        String valueType,
        String description,
        String min,
        String max,
        boolean isPublic,
        Instant updatedAt
) {
}
