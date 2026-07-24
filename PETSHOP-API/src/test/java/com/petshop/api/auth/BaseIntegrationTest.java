package com.petshop.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.auth.api.dto.LoginRequest;
import com.petshop.api.auth.api.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Abstract base class for integration tests using Testcontainers PostgreSQL.
 * <p>
 * Provides a shared PostgreSQL container with Flyway auto-migration,
 * MockMvc for HTTP testing, and helper methods for user registration/login.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public abstract class BaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("petshop_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    /**
     * Registers a new user and returns the AuthResponse containing tokens.
     *
     * @param fullName the user's full name
     * @param email    the user's email address
     * @param password the user's password
     * @return AuthResponse with userId, accessToken, refreshToken, tokenType, expiresIn
     * @throws Exception if the request fails
     */
    protected AuthResponse registerUser(String fullName, String email, String password) throws Exception {
        RegisterRequest request = new RegisterRequest(fullName, email, password, null);

        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readValue(
                result.getResponse().getContentAsString(),
                AuthResponse.class
        );
    }

    /**
     * Logs in an existing user and returns the AuthResponse containing tokens.
     *
     * @param email    the user's email address
     * @param password the user's password
     * @return AuthResponse with userId, accessToken, refreshToken, tokenType, expiresIn
     * @throws Exception if the request fails
     */
    protected AuthResponse loginUser(String email, String password) throws Exception {
        LoginRequest request = new LoginRequest(email, password);

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readValue(
                result.getResponse().getContentAsString(),
                AuthResponse.class
        );
    }
}
