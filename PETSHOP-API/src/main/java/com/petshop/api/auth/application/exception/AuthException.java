package com.petshop.api.auth.application.exception;

/**
 * Abstract base for all authentication/authorization exceptions.
 */
public abstract class AuthException extends RuntimeException {

    protected AuthException(String message) {
        super(message);
    }

    protected AuthException(String message, Throwable cause) {
        super(message, cause);
    }
}
