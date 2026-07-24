package com.petshop.api.auth.application.exception;

/**
 * Thrown when login credentials are invalid (email not found or password mismatch).
 * Maps to HTTP 401 with a generic message that does not reveal which credential was wrong.
 */
public class InvalidCredentialsException extends AuthException {

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}
