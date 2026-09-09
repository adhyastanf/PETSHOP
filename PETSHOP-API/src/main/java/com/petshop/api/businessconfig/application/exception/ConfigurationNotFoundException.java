package com.petshop.api.businessconfig.application.exception;

/**
 * Thrown when a requested business configuration key or entity does not exist.
 */
public class ConfigurationNotFoundException extends RuntimeException {
    public ConfigurationNotFoundException(String message) {
        super(message);
    }
}
