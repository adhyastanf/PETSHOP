package com.petshop.api.pet;

import com.petshop.api.auth.BaseIntegrationTest;
import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.entity.pet.Pet;
import com.petshop.api.entity.pet.PetType;
import com.petshop.api.entity.pet.PetVaccination;
import com.petshop.api.entity.pet.VaccineType;
import com.petshop.api.pet.api.dto.PetRequest;
import com.petshop.api.pet.persistence.PetRepository;
import com.petshop.api.pet.persistence.PetTypeRepository;
import com.petshop.api.pet.persistence.PetVaccinationRepository;
import com.petshop.api.pet.persistence.VaccineTypeRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import javax.crypto.SecretKey;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PetPhase2IntegrationTest extends BaseIntegrationTest {

    private static final String SECRET = "test-secret-key-that-is-at-least-32-bytes-long!!";

    @Autowired
    private PetTypeRepository petTypeRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PetVaccinationRepository petVaccinationRepository;

    @Autowired
    private VaccineTypeRepository vaccineTypeRepository;

    @Test
    void customerCanManageOnlyOwnPets() throws Exception {
        AuthResponse owner = registerUser("Pet Owner", "pet-owner@example.com", "SecurePass123");
        AuthResponse other = registerUser("Pet Other", "pet-other@example.com", "SecurePass123");
        PetType dog = petTypeRepository.findByIsActiveTrueOrderBySortOrderAscNameAsc().getFirst();

        String responseBody = mockMvc.perform(post("/api/v1/pets")
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pet("Milo", dog.getId(), null, "MC-001"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Milo")))
                .andExpect(jsonPath("$.petTypeId", is(dog.getId().toString())))
                .andReturn()
                .getResponse()
                .getContentAsString();
        UUID petId = objectMapper.readTree(responseBody).get("id").traverse(objectMapper).readValueAs(UUID.class);

        mockMvc.perform(get("/api/v1/pets")
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(get("/api/v1/pets/{petId}", petId)
                        .header("Authorization", "Bearer " + other.accessToken()))
                .andExpect(status().isNotFound());

        mockMvc.perform(patch("/api/v1/pets/{petId}", petId)
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pet("Milo Updated", dog.getId(), null, "MC-001"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Milo Updated")));

        mockMvc.perform(delete("/api/v1/pets/{petId}", petId)
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/pets/{petId}", petId)
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isNotFound());
    }

    @Test
    void petReferenceDataAndValidationWork() throws Exception {
        AuthResponse auth = registerUser("Pet Validation", "pet-validation@example.com", "SecurePass123");
        PetType dog = petTypeRepository.findByIsActiveTrueOrderBySortOrderAscNameAsc().getFirst();
        PetType cat = petTypeRepository.findByIsActiveTrueOrderBySortOrderAscNameAsc().get(1);
        UUID dogBreedId = mockMvc.perform(get("/api/v1/pets/breeds")
                        .param("petTypeId", dog.getId().toString())
                        .header("Authorization", "Bearer " + auth.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", notNullValue()))
                .andReturn()
                .getResponse()
                .getContentAsString()
                .describeConstable()
                .map(body -> {
                    try {
                        return objectMapper.readTree(body).get(0).get("id").traverse(objectMapper).readValueAs(UUID.class);
                    } catch (Exception e) {
                        throw new IllegalStateException(e);
                    }
                })
                .orElseThrow();

        mockMvc.perform(get("/api/v1/pets/types")
                        .header("Authorization", "Bearer " + auth.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(1)));

        mockMvc.perform(post("/api/v1/pets")
                        .header("Authorization", "Bearer " + auth.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pet("Breed Mismatch", cat.getId(), dogBreedId, null))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void vaccinationHistoryIsVisibleOnlyForOwnedPet() throws Exception {
        AuthResponse owner = registerUser("Vaccine Owner", "vaccine-owner@example.com", "SecurePass123");
        AuthResponse other = registerUser("Vaccine Other", "vaccine-other@example.com", "SecurePass123");
        PetType dog = petTypeRepository.findByIsActiveTrueOrderBySortOrderAscNameAsc().getFirst();
        UUID petId = createPet(owner, dog.getId());
        Pet pet = petRepository.findById(petId).orElseThrow();
        VaccineType vaccineType = vaccineTypeRepository.findAll().getFirst();

        PetVaccination vaccination = PetVaccination.builder()
                .pet(pet)
                .vaccineType(vaccineType)
                .vaccineNameSnapshot(vaccineType.getName())
                .vaccinationDate(LocalDate.of(2026, 1, 15))
                .nextVaccinationDate(LocalDate.of(2027, 1, 15))
                .batchNumber("BATCH-1")
                .createdBy(owner.userId())
                .build();
        petVaccinationRepository.save(vaccination);

        mockMvc.perform(get("/api/v1/pets/{petId}/vaccinations", petId)
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].vaccineNameSnapshot", is(vaccineType.getName())));

        mockMvc.perform(get("/api/v1/pets/{petId}/vaccinations", petId)
                        .header("Authorization", "Bearer " + other.accessToken()))
                .andExpect(status().isNotFound());
    }

    @Test
    void petEndpointsRejectAnonymousAndNonCustomerRoles() throws Exception {
        mockMvc.perform(get("/api/v1/pets"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/pets")
                        .header("Authorization", "Bearer " + tokenWithAuthorities("ROLE_SUPER_ADMIN")))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/pets")
                        .header("Authorization", "Bearer " + tokenWithAuthorities("ROLE_PETSHOP_OWNER")))
                .andExpect(status().isForbidden());
    }

    private UUID createPet(AuthResponse auth, UUID petTypeId) throws Exception {
        String body = mockMvc.perform(post("/api/v1/pets")
                        .header("Authorization", "Bearer " + auth.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pet("Buddy", petTypeId, null, null))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(body).get("id").traverse(objectMapper).readValueAs(UUID.class);
    }

    private PetRequest pet(String name, UUID petTypeId, UUID breedId, String microchipNumber) {
        return new PetRequest(
                name,
                petTypeId,
                breedId,
                "MALE",
                LocalDate.of(2022, 5, 3),
                false,
                new BigDecimal("8.50"),
                "Brown",
                true,
                microchipNumber,
                null,
                null,
                "Needs a calm handler");
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
