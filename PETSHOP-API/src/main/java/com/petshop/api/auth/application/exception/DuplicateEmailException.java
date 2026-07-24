package com.petshop.api.auth.application.exception;

/**
 * Thrown when a registration request contains an email that already exists.
 * Maps to HTTP 409 with code EMAIL_ALREADY_EXISTS.
 */
public class DuplicateEmailException extends AuthException {

    public DuplicateEmailException() {
        super("The email address is already registered");
    }
}
