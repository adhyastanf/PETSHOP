package com.petshop.api.auth;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Smoke test to verify the Testcontainers integration test infrastructure works.
 * Validates that the Spring context loads with the PostgreSQL container and
 * Flyway migrations are applied successfully.
 */
class BaseIntegrationSmokeTest extends BaseIntegrationTest {

    @Test
    void contextLoads() {
        // If we get here, the Spring context loaded successfully with Testcontainers PostgreSQL
        assertThat(mockMvc).isNotNull();
        assertThat(objectMapper).isNotNull();
    }

    @Test
    void postgresContainerIsRunning() {
        assertThat(postgres.isRunning()).isTrue();
    }

    @Test
    void healthEndpointIsAccessible() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }
}
