package com.petshop.api.auth;

import com.petshop.api.auth.api.dto.LoginRequest;
import com.petshop.api.auth.domain.User;
import com.petshop.api.auth.domain.UserStatus;
import com.petshop.api.auth.persistence.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the login endpoint (POST /api/v1/auth/login).
 * Validates Requirements 10.5 and 10.6.
 */
class AuthLoginIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    /**
     * Req 10.5: Successful login returns HTTP 200 with valid tokens.
     */
    @Test
    void successfulLogin_returns200WithTokens() throws Exception {
        // Register a user first
        String email = "login-success@example.com";
        String password = "SecurePass123";
        registerUser("Login User", email, password);

        // Now login with the same credentials
        LoginRequest loginRequest = new LoginRequest(email, password);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.expiresIn", is(900)));
    }

    /**
     * Req 10.6: Login with non-existent email returns 401 with generic error.
     */
    @Test
    void wrongEmail_returns401Generic() throws Exception {
        LoginRequest loginRequest = new LoginRequest("nonexistent@example.com", "AnyPassword1");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Req 10.6: Login with wrong password returns 401 with same generic message
     * as wrong email (messages should be identical — no credential leak).
     */
    @Test
    void wrongPassword_returns401Generic() throws Exception {
        String email = "login-wrongpw@example.com";
        String password = "CorrectPass123";
        registerUser("Wrong PW User", email, password);

        // Login with wrong password
        LoginRequest loginRequest = new LoginRequest(email, "WrongPassword99");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Login with SUSPENDED account returns 403 with code ACCOUNT_SUSPENDED.
     */
    @Test
    void loginSuspendedAccount_returns403() throws Exception {
        String email = "suspended-user@example.com";
        String password = "SecurePass123";
        registerUser("Suspended User", email, password);

        // Update user status to SUSPENDED directly via repository
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setStatus(UserStatus.SUSPENDED);
        userRepository.save(user);

        // Attempt login
        LoginRequest loginRequest = new LoginRequest(email, password);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code", is("ACCOUNT_SUSPENDED")));
    }

    /**
     * Login with INACTIVE account returns 403 with code ACCOUNT_INACTIVE.
     */
    @Test
    void loginInactiveAccount_returns403() throws Exception {
        String email = "inactive-user@example.com";
        String password = "SecurePass123";
        registerUser("Inactive User", email, password);

        // Update user status to INACTIVE directly via repository
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);

        // Attempt login
        LoginRequest loginRequest = new LoginRequest(email, password);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code", is("ACCOUNT_INACTIVE")));
    }

    /**
     * Login with BLOCKED account returns 403 with code ACCOUNT_BLOCKED.
     */
    @Test
    void loginBlockedAccount_returns403() throws Exception {
        String email = "blocked-user@example.com";
        String password = "SecurePass123";
        registerUser("Blocked User", email, password);

        // Update user status to BLOCKED directly via repository
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setStatus(UserStatus.BLOCKED);
        userRepository.save(user);

        // Attempt login
        LoginRequest loginRequest = new LoginRequest(email, password);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code", is("ACCOUNT_BLOCKED")));
    }
}
