package com.petshop.api.customer;

import com.petshop.api.auth.BaseIntegrationTest;
import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.customer.api.dto.AddressDefaultRequest;
import com.petshop.api.customer.api.dto.AddressRequest;
import com.petshop.api.customer.api.dto.UpdateCustomerProfileRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CustomerPhase2IntegrationTest extends BaseIntegrationTest {

    private static final String SECRET = "test-secret-key-that-is-at-least-32-bytes-long!!";

    @Test
    void customerCanViewAndUpdateOwnProfile() throws Exception {
        AuthResponse auth = registerUser("Profile Owner", "profile-owner@example.com", "SecurePass123");

        mockMvc.perform(get("/api/v1/customer/profile")
                        .header("Authorization", "Bearer " + auth.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", is(auth.userId().toString())))
                .andExpect(jsonPath("$.fullName", is("Profile Owner")))
                .andExpect(jsonPath("$.email", is("profile-owner@example.com")));

        UpdateCustomerProfileRequest request = new UpdateCustomerProfileRequest(
                "Updated Owner",
                "+628123456789",
                null,
                "FEMALE",
                LocalDate.of(1995, 4, 12));

        mockMvc.perform(patch("/api/v1/customer/profile")
                        .header("Authorization", "Bearer " + auth.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName", is("Updated Owner")))
                .andExpect(jsonPath("$.phoneNumber", is("+628123456789")))
                .andExpect(jsonPath("$.gender", is("FEMALE")))
                .andExpect(jsonPath("$.birthDate", is("1995-04-12")));
    }

    @Test
    void customerCanManageOnlyOwnAddresses() throws Exception {
        AuthResponse owner = registerUser("Address Owner", "address-owner@example.com", "SecurePass123");
        AuthResponse other = registerUser("Address Other", "address-other@example.com", "SecurePass123");

        String firstAddressBody = mockMvc.perform(post("/api/v1/customer/addresses")
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(address("Home", false))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.isDefault", is(true)))
                .andReturn()
                .getResponse()
                .getContentAsString();
        UUID firstAddressId = objectMapper.readTree(firstAddressBody).get("id").traverse(objectMapper).readValueAs(UUID.class);

        String secondAddressBody = mockMvc.perform(post("/api/v1/customer/addresses")
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(address("Office", true))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isDefault", is(true)))
                .andReturn()
                .getResponse()
                .getContentAsString();
        UUID secondAddressId = objectMapper.readTree(secondAddressBody).get("id").traverse(objectMapper).readValueAs(UUID.class);

        mockMvc.perform(get("/api/v1/customer/addresses")
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get("/api/v1/customer/addresses/{addressId}", firstAddressId)
                        .header("Authorization", "Bearer " + other.accessToken()))
                .andExpect(status().isNotFound());

        mockMvc.perform(patch("/api/v1/customer/addresses/{addressId}/default", firstAddressId)
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddressDefaultRequest(true))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isDefault", is(true)));

        mockMvc.perform(get("/api/v1/customer/addresses/{addressId}", secondAddressId)
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isDefault", is(false)));

        mockMvc.perform(delete("/api/v1/customer/addresses/{addressId}", firstAddressId)
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/customer/addresses/{addressId}", firstAddressId)
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isNotFound());
    }

    @Test
    void addressEndpointsRejectAnonymousAndNonCustomerRoles() throws Exception {
        mockMvc.perform(get("/api/v1/customer/addresses"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/customer/addresses")
                        .header("Authorization", "Bearer " + tokenWithAuthorities("ROLE_SUPER_ADMIN")))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/customer/addresses")
                        .header("Authorization", "Bearer " + tokenWithAuthorities("ROLE_PETSHOP_OWNER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void addressValidationRejectsRequiredFieldFailures() throws Exception {
        AuthResponse auth = registerUser("Invalid Address", "invalid-address@example.com", "SecurePass123");
        AddressRequest request = new AddressRequest(
                "Home", "", "123", null, null, null, null, null, null,
                null, null, "", "", null, null, null, false);

        mockMvc.perform(post("/api/v1/customer/addresses")
                        .header("Authorization", "Bearer " + auth.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    private AddressRequest address(String label, boolean isDefault) {
        return new AddressRequest(
                label,
                "Jane Doe",
                "+62811111111",
                "31",
                "DKI Jakarta",
                "3171",
                "Jakarta Selatan",
                "317101",
                "Tebet",
                "31710101",
                "Manggarai",
                "12850",
                "Jl. Petshop No. 1",
                null,
                null,
                "Ring the bell",
                isDefault);
    }

    private String tokenWithAuthorities(String... authorities) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(UUID.randomUUID().toString())
                .claim("authorities", List.of(authorities))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(900)))
                .signWith(key)
                .compact();
    }
}
