package com.petshop.api.auth.application.exception;

/**
 * Thrown when a login is attempted on an INACTIVE account.
 * Maps to HTTP 403 with code ACCOUNT_INACTIVE.
 */
public class AccountInactiveException extends AccountStatusException {

    public AccountInactiveException() {
        super("Account is inactive");
    }
}
