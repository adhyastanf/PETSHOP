package com.petshop.api.auth.application.exception;

/**
 * Thrown when a login is attempted on a BLOCKED account.
 * Maps to HTTP 403 with code ACCOUNT_BLOCKED.
 */
public class AccountBlockedException extends AccountStatusException {

    public AccountBlockedException() {
        super("Account is blocked");
    }
}
