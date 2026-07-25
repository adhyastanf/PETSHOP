package com.petshop.api.pet.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.pet.api.dto.PetBreedResponse;
import com.petshop.api.pet.api.dto.PetRequest;
import com.petshop.api.pet.api.dto.PetResponse;
import com.petshop.api.pet.api.dto.PetTypeResponse;
import com.petshop.api.pet.api.dto.VaccinationResponse;
import com.petshop.api.pet.application.PetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pets")
@PreAuthorize("hasAuthority('ROLE_CUSTOMER') or hasAuthority('ROLE_SUPER_ADMIN')")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping("/types")
    public List<PetTypeResponse> listPetTypes() {
        return petService.listPetTypes();
    }

    @GetMapping("/breeds")
    public List<PetBreedResponse> listBreeds(@RequestParam UUID petTypeId) {
        return petService.listBreeds(petTypeId);
    }

    @GetMapping
    public List<PetResponse> listPets() {
        return petService.listPets(currentUserId());
    }

    @PostMapping
    public ResponseEntity<PetResponse> createPet(@Valid @RequestBody PetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(petService.createPet(currentUserId(), request));
    }

    @GetMapping("/{petId}")
    public PetResponse getPet(@PathVariable UUID petId) {
        return petService.getPet(currentUserId(), petId);
    }

    @PatchMapping("/{petId}")
    public PetResponse updatePet(@PathVariable UUID petId, @Valid @RequestBody PetRequest request) {
        return petService.updatePet(currentUserId(), petId, request);
    }

    @DeleteMapping("/{petId}")
    public ResponseEntity<Void> deletePet(@PathVariable UUID petId) {
        petService.deletePet(currentUserId(), petId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{petId}/vaccinations")
    public List<VaccinationResponse> listVaccinations(@PathVariable UUID petId) {
        return petService.listVaccinations(currentUserId(), petId);
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
