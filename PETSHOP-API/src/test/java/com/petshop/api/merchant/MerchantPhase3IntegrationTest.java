package com.petshop.api.merchant;

import com.petshop.api.auth.BaseIntegrationTest;
import com.petshop.api.auth.api.dto.AuthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
class MerchantPhase3IntegrationTest extends BaseIntegrationTest {

    @Test
    void merchantApplicationAndVerificationFlow() throws Exception {
        // 1. Register a customer
        AuthResponse customer = registerUser("Merchant Owner", "owner@test.com", "SecurePass123");

        // 2. Apply as merchant
        mockMvc.perform(post("/api/v1/merchant/applications")
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"businessName": "Happy Paws Pet Shop", "displayName": "Happy Paws", "email": "shop@happypaws.com"}
                            """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.businessName", is("Happy Paws Pet Shop")))
                .andExpect(jsonPath("$.verificationStatus", is("SUBMITTED")));

        // 3. View application status
        mockMvc.perform(get("/api/v1/merchant/applications/mine")
                        .header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].verificationStatus", is("SUBMITTED")));

        // 4. Duplicate application should fail
        mockMvc.perform(post("/api/v1/merchant/applications")
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"businessName": "Another Shop"}
                            """))
                .andExpect(status().isConflict());
    }

    @Test
    void unauthenticatedCannotApply() throws Exception {
        mockMvc.perform(post("/api/v1/merchant/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"businessName": "Test Shop"}
                            """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void merchantProfileRequiresApproval() throws Exception {
        AuthResponse customer = registerUser("Not Approved", "notapproved@test.com", "SecurePass123");

        // Profile access should fail — no approved merchant
        mockMvc.perform(get("/api/v1/merchant/profile")
                        .header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isForbidden());
    }

    @Test
    void branchCrudRequiresOwner() throws Exception {
        AuthResponse customer = registerUser("Branch Test", "branchtest@test.com", "SecurePass123");

        // Non-merchant cannot create branch
        mockMvc.perform(post("/api/v1/merchant/branches")
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"name": "Main Branch"}
                            """))
                .andExpect(status().isForbidden());
    }

    @Test
    void staffEndpointsRejectNonMerchantUsers() throws Exception {
        AuthResponse customer = registerUser("Staff Test", "stafftest@test.com", "SecurePass123");

        mockMvc.perform(get("/api/v1/merchant/staff")
                        .header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isForbidden());
    }
}
