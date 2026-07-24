package com.petshop.api.auth;

import com.petshop.api.auth.domain.User;
import com.petshop.api.auth.persistence.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for the customer registration endpoint POST /api/v1/auth/register.
 * Validates Requirements 10.2, 10.3, 10.4.
 */
class AuthRegistrationIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    private String uniqueEmail() {
        return "test-" + UUID.randomUUID() + "@example.com";
    }

    @Test
    void successfulRegistration_returns201WithTokens() throws Exception {
        String email = uniqueEmail();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "fullName": "Test User",
                                    "email": "%s",
                                    "password": "SecurePass123"
                                }
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").isNotEmpty())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(900));
    }

    @Test
    void duplicateEmail_returns409() throws Exception {
        String email = uniqueEmail();

        // First registration should succeed
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "fullName": "First User",
                                    "email": "%s",
                                    "password": "SecurePass123"
                                }
                                """.formatted(email)))
                .andExpect(status().isCreated());

        // Second registration with same email should return 409
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "fullName": "Second User",
                                    "email": "%s",
                                    "password": "AnotherPass456"
                                }
                                """.formatted(email)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("EMAIL_ALREADY_EXISTS"));
    }

    @Test
    void storedPasswordHash_isBcryptNotPlaintext() throws Exception {
        String email = uniqueEmail();
        String plainPassword = "MyPlainTextPass99";

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "fullName": "BCrypt Test User",
                                    "email": "%s",
                                    "password": "%s"
                                }
                                """.formatted(email, plainPassword)))
                .andExpect(status().isCreated());

        // Verify the stored password hash in the database
        Optional<User> userOpt = userRepository.findByEmail(email);
        assertThat(userOpt).isPresent();

        String storedHash = userOpt.get().getPasswordHash();
        assertThat(storedHash)
                .as("Password hash should start with BCrypt prefix")
                .startsWith("$2a$");
        assertThat(storedHash)
                .as("Password hash must not equal the plaintext password")
                .isNotEqualTo(plainPassword);
    }

    @Test
    void missingEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "fullName": "No Email User",
                                    "password": "SecurePass123"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void shortPassword_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "fullName": "Short Pass User",
                                    "email": "%s",
                                    "password": "1234567"
                                }
                                """.formatted(uniqueEmail())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void invalidEmailFormat_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "fullName": "Bad Email User",
                                    "email": "not-an-email",
                                    "password": "SecurePass123"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }
}
