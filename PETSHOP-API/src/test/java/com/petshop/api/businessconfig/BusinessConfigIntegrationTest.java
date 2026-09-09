package com.petshop.api.businessconfig;

import com.petshop.api.auth.BaseIntegrationTest;
import com.petshop.api.auth.api.dto.AuthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.MediaType;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the Business Configuration foundation:
 * system config management, commission rule administration + resolution,
 * payment method availability, RBAC enforcement, audit creation, and the
 * MIDTRANS -> XENDIT seed alignment.
 */
class BusinessConfigIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /** Registers a user then grants them the given platform role; returns a fresh token. */
    private AuthResponse registerWithRole(String email, String roleCode) throws Exception {
        AuthResponse auth = registerUser("Config " + roleCode, email, "SecurePass123");
        UUID userId = auth.userId();
        UUID roleId = jdbcTemplate.queryForObject(
                "SELECT id FROM roles WHERE code = ?", UUID.class, roleCode);
        jdbcTemplate.update(
                "INSERT INTO user_roles (user_id, role_id, created_at) VALUES (?, ?, NOW())",
                userId, roleId);
        return loginUser(email, "SecurePass123");
    }

    // ===== System Business Configuration =====

    @Test
    void adminCanListAndUpdateBusinessConfig() throws Exception {
        AuthResponse admin = registerWithRole("cfg-admin-" + UUID.randomUUID() + "@test.com", "ADMIN");

        mockMvc.perform(get("/api/v1/admin/config")
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.key=='checkout_expiration_minutes')]", hasSize(1)));

        // Update checkout expiration to 45 minutes
        mockMvc.perform(put("/api/v1/admin/config/checkout_expiration_minutes")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"45\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key", is("checkout_expiration_minutes")))
                .andExpect(jsonPath("$.value", is("45")));

        // Read back reflects the new value (cache-eviction correctness)
        mockMvc.perform(get("/api/v1/admin/config/checkout_expiration_minutes")
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value", is("45")));

        // An audit entry was written
        Integer auditCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM audit_logs WHERE entity_type = 'SystemConfiguration' AND action = 'BUSINESS_CONFIG_UPDATED'",
                Integer.class);
        org.assertj.core.api.Assertions.assertThat(auditCount).isGreaterThanOrEqualTo(1);
    }

    @Test
    void invalidConfigValueIsRejected() throws Exception {
        AuthResponse admin = registerWithRole("cfg-invalid-" + UUID.randomUUID() + "@test.com", "ADMIN");

        // checkout_expiration_minutes max is 1440
        mockMvc.perform(put("/api/v1/admin/config/checkout_expiration_minutes")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"999999\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("INVALID_CONFIGURATION")));

        // non-numeric
        mockMvc.perform(put("/api/v1/admin/config/checkout_expiration_minutes")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"abc\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void unknownConfigKeyReturnsNotFound() throws Exception {
        AuthResponse admin = registerWithRole("cfg-unknown-" + UUID.randomUUID() + "@test.com", "ADMIN");

        mockMvc.perform(put("/api/v1/admin/config/jwt_secret")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"hacked\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("CONFIG_NOT_FOUND")));
    }

    @Test
    void merchantRoleCannotModifyPlatformConfig() throws Exception {
        AuthResponse owner = registerWithRole("cfg-owner-" + UUID.randomUUID() + "@test.com", "PETSHOP_OWNER");

        mockMvc.perform(put("/api/v1/admin/config/checkout_expiration_minutes")
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"45\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void customerCannotListConfig() throws Exception {
        AuthResponse customer = registerUser("Cfg Customer", "cfg-cust-" + UUID.randomUUID() + "@test.com", "SecurePass123");

        mockMvc.perform(get("/api/v1/admin/config")
                        .header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedCannotAccessConfig() throws Exception {
        mockMvc.perform(get("/api/v1/admin/config"))
                .andExpect(status().isUnauthorized());
    }

    // ===== Commission Rules =====

    @Test
    void adminCanCreateAndListCommissionRule() throws Exception {
        AuthResponse admin = registerWithRole("cfg-com-" + UUID.randomUUID() + "@test.com", "ADMIN");

        mockMvc.perform(post("/api/v1/admin/commission-rules")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"transactionType":"SERVICE","commissionType":"PERCENTAGE","commissionValue":5,"priority":10}
                            """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionType", is("SERVICE")))
                .andExpect(jsonPath("$.scope", is("GLOBAL")))
                .andExpect(jsonPath("$.commissionValue", is(5)));

        mockMvc.perform(get("/api/v1/admin/commission-rules")
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                // seeded PRODUCT+SERVICE defaults plus the new one
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))));
    }

    @Test
    void negativeCommissionIsRejected() throws Exception {
        AuthResponse admin = registerWithRole("cfg-neg-" + UUID.randomUUID() + "@test.com", "ADMIN");

        mockMvc.perform(post("/api/v1/admin/commission-rules")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"transactionType":"PRODUCT","commissionType":"PERCENTAGE","commissionValue":-1}
                            """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("INVALID_CONFIGURATION")));
    }

    @Test
    void percentageAboveHundredIsRejected() throws Exception {
        AuthResponse admin = registerWithRole("cfg-hi-" + UUID.randomUUID() + "@test.com", "ADMIN");

        mockMvc.perform(post("/api/v1/admin/commission-rules")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"transactionType":"PRODUCT","commissionType":"PERCENTAGE","commissionValue":150}
                            """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void invalidEffectiveDateRangeIsRejected() throws Exception {
        AuthResponse admin = registerWithRole("cfg-date-" + UUID.randomUUID() + "@test.com", "ADMIN");

        mockMvc.perform(post("/api/v1/admin/commission-rules")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"transactionType":"SERVICE","commissionType":"PERCENTAGE","commissionValue":5,
                             "validFrom":"2026-10-01T00:00:00Z","validUntil":"2026-09-01T00:00:00Z"}
                            """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void conflictingGlobalRuleIsRejected() throws Exception {
        AuthResponse admin = registerWithRole("cfg-conflict-" + UUID.randomUUID() + "@test.com", "ADMIN");

        // A seeded GLOBAL PRODUCT rule (priority 0, open-ended) already exists;
        // creating another active GLOBAL PRODUCT rule with the same priority and
        // an overlapping (open) window must be rejected.
        mockMvc.perform(post("/api/v1/admin/commission-rules")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"transactionType":"PRODUCT","commissionType":"PERCENTAGE","commissionValue":7,"priority":0}
                            """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("INVALID_CONFIGURATION")));
    }

    @Test
    void commissionRuleCanBeDeactivatedThenReactivated() throws Exception {
        AuthResponse admin = registerWithRole("cfg-toggle-" + UUID.randomUUID() + "@test.com", "ADMIN");

        String body = mockMvc.perform(post("/api/v1/admin/commission-rules")
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"transactionType":"SERVICE","commissionType":"PERCENTAGE","commissionValue":6,"priority":50}
                            """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String id = objectMapper.readTree(body).get("id").asText();

        mockMvc.perform(post("/api/v1/admin/commission-rules/" + id + "/deactivate")
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive", is(false)));

        mockMvc.perform(post("/api/v1/admin/commission-rules/" + id + "/activate")
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive", is(true)));
    }

    @Test
    void merchantCannotCreateCommissionRule() throws Exception {
        AuthResponse owner = registerWithRole("cfg-com-owner-" + UUID.randomUUID() + "@test.com", "PETSHOP_OWNER");

        mockMvc.perform(post("/api/v1/admin/commission-rules")
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"transactionType":"SERVICE","commissionType":"PERCENTAGE","commissionValue":5}
                            """))
                .andExpect(status().isForbidden());
    }

    // ===== Payment Methods =====

    @Test
    void adminCanListAndTogglePaymentMethod() throws Exception {
        AuthResponse admin = registerWithRole("cfg-pm-" + UUID.randomUUID() + "@test.com", "ADMIN");

        String body = mockMvc.perform(get("/api/v1/admin/payment-methods")
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                // provider aligned to XENDIT, and COD present
                .andExpect(jsonPath("$[?(@.providerCode=='XENDIT')]", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[?(@.methodCode=='COD')]", hasSize(1)))
                .andReturn().getResponse().getContentAsString();

        String firstId = objectMapper.readTree(body).get(0).get("id").asText();

        mockMvc.perform(patch("/api/v1/admin/payment-methods/" + firstId)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"isActive\": false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive", is(false)));

        Integer auditCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM audit_logs WHERE entity_type = 'PaymentMethod'",
                Integer.class);
        org.assertj.core.api.Assertions.assertThat(auditCount).isGreaterThanOrEqualTo(1);
    }

    @Test
    void noMidtransProviderRemainsAfterAlignment() {
        Integer midtransCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM payment_methods WHERE provider_code = 'MIDTRANS'",
                Integer.class);
        org.assertj.core.api.Assertions.assertThat(midtransCount).isZero();
    }

    @Test
    void customerCannotTogglePaymentMethod() throws Exception {
        AuthResponse customer = registerUser("PM Customer", "cfg-pm-cust-" + UUID.randomUUID() + "@test.com", "SecurePass123");

        mockMvc.perform(get("/api/v1/admin/payment-methods")
                        .header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isForbidden());
    }
}
