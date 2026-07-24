package com.petshop.api.auth.application;

import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.auth.api.dto.LoginRequest;
import com.petshop.api.auth.api.dto.RegisterRequest;

/**
 * Service responsible for registration and login orchestration.
 */
public interface AuthService {

    /**
     * Registers a new customer account.
     *
     * @param request the registration data
     * @return AuthResponse with userId and token pair
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates a user with email/password credentials.
     *
     * @param request the login data
     * @return AuthResponse with token pair
     */
    AuthResponse login(LoginRequest request);
}
