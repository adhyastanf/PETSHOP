package com.petshop.api.auth.api.dto;

import java.time.Instant;
import java.util.List;

/**
 * Standard error response format per API_CONTRACT.md.
 *
 * @param code      Stable, machine-readable error code (e.g. "UNAUTHENTICATED")
 * @param message   Human-readable error description
 * @param details   Per-field validation details (empty list for non-validation errors)
 * @param timestamp ISO-8601 timestamp of the error occurrence
 * @param traceId   Trace identifier for correlation (empty string if unavailable)
 */
public record ErrorResponse(
        String code,
        String message,
        List<FieldError> details,
        Instant timestamp,
        String traceId
) {

    /**
     * Represents a single field-level validation error.
     *
     * @param field   The field name that failed validation
     * @param message The validation failure message
     */
    public record FieldError(
            String field,
            String message
    ) {
    }

    /**
     * Factory for creating error responses without field-level details.
     */
    public static ErrorResponse of(String code, String message, String traceId) {
        return new ErrorResponse(code, message, List.of(), Instant.now(), traceId);
    }

    /**
     * Factory for creating validation error responses with field-level details.
     */
    public static ErrorResponse ofValidation(String message, List<FieldError> details, String traceId) {
        return new ErrorResponse("VALIDATION_ERROR", message, details, Instant.now(), traceId);
    }
}
