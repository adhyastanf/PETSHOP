package com.petshop.api.auth.application.exception;

/**
 * Thrown when a refresh token is invalid, expired, revoked, or not found.
 * Maps to HTTP 401 with code INVALID_REFRESH_TOKEN.
 */
public class InvalidTokenException extends AuthException {

    public InvalidTokenException() {
        super("The refresh token is invalid or has expired");
    }

    public InvalidTokenException(String message) {
        super(message);
    }

    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
