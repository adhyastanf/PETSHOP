package com.petshop.api.auth.application.exception;

/**
 * Base exception for account status violations during login.
 * Maps to HTTP 403.
 */
public abstract class AccountStatusException extends AuthException {

    protected AccountStatusException(String message) {
        super(message);
    }
}
