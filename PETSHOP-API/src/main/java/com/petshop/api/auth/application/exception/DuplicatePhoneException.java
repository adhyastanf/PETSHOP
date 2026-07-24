package com.petshop.api.auth.application.exception;

/**
 * Thrown when a registration request contains a phone number that already exists.
 * Maps to HTTP 409 with code PHONE_ALREADY_EXISTS.
 */
public class DuplicatePhoneException extends AuthException {

    public DuplicatePhoneException() {
        super("The phone number is already registered");
    }
}
