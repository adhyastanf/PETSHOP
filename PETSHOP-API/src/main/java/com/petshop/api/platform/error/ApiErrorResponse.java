package com.petshop.api.platform.error;

import java.time.Instant;
import java.util.List;

/**
 * Canonical API error response contract for the platform.
 * All modules should use this format for error responses.
 * Mirrors the existing auth ErrorResponse pattern: {code, message, details[], timestamp, traceId}.
 *
 * @param code      stable, machine-readable error code (e.g. "UNAUTHENTICATED", "NOT_FOUND")
 * @param message   human-readable error description
 * @param details   per-field validation details (empty list for non-validation errors)
 * @param timestamp ISO-8601 timestamp of the error occurrence
 * @param traceId   trace identifier for correlation (empty string if unavailable)
 */
public record ApiErrorResponse(
        String code,
        String message,
        List<FieldError> details,
        Instant timestamp,
        String traceId
) {

    /**
     * Represents a single field-level validation error.
     *
     * @param field   the field name that failed validation
     * @param message the validation failure message
     */
    public record FieldError(
            String field,
            String message
    ) {}

    /**
     * Factory for creating error responses without field-level details.
     */
    public static ApiErrorResponse of(String code, String message, String traceId) {
        return new ApiErrorResponse(code, message, List.of(), Instant.now(), traceId);
    }

    /**
     * Factory for creating error responses without field-level details (no trace).
     */
    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(code, message, List.of(), Instant.now(), "");
    }

    /**
     * Factory for creating validation error responses with field-level details.
     */
    public static ApiErrorResponse ofValidation(String message, List<FieldError> details, String traceId) {
        return new ApiErrorResponse("VALIDATION_ERROR", message, details, Instant.now(), traceId);
    }
}
