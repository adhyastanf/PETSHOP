package com.petshop.api.auth.application.exception;

/**
 * Thrown when a login is attempted on a SUSPENDED account.
 * Maps to HTTP 403 with code ACCOUNT_SUSPENDED.
 */
public class AccountSuspendedException extends AccountStatusException {

    public AccountSuspendedException() {
        super("Account is suspended");
    }
}
