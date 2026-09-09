package com.petshop.api.businessconfig.application.exception;

/**
 * Thrown when a business configuration value or commission rule fails
 * server-side validation (invalid type, out of range, conflicting rule, etc.).
 */
public class InvalidConfigurationException extends RuntimeException {
    public InvalidConfigurationException(String message) {
        super(message);
    }
}
