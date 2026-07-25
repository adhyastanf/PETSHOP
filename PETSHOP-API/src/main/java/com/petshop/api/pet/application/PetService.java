package com.petshop.api.pet.application;

import com.petshop.api.auth.domain.User;
import com.petshop.api.auth.persistence.UserRepository;
import com.petshop.api.entity.pet.Pet;
import com.petshop.api.entity.pet.PetBreed;
import com.petshop.api.entity.pet.PetType;
import com.petshop.api.entity.pet.PetVaccination;
import com.petshop.api.exception.BadRequestException;
import com.petshop.api.exception.ResourceNotFoundExeption;
import com.petshop.api.pet.api.dto.PetBreedResponse;
import com.petshop.api.pet.api.dto.PetRequest;
import com.petshop.api.pet.api.dto.PetResponse;
import com.petshop.api.pet.api.dto.PetTypeResponse;
import com.petshop.api.pet.api.dto.VaccinationResponse;
import com.petshop.api.pet.persistence.PetBreedRepository;
import com.petshop.api.pet.persistence.PetRepository;
import com.petshop.api.pet.persistence.PetTypeRepository;
import com.petshop.api.pet.persistence.PetVaccinationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PetService {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final PetTypeRepository petTypeRepository;
    private final PetBreedRepository petBreedRepository;
    private final PetVaccinationRepository petVaccinationRepository;

    public PetService(
            UserRepository userRepository,
            PetRepository petRepository,
            PetTypeRepository petTypeRepository,
            PetBreedRepository petBreedRepository,
            PetVaccinationRepository petVaccinationRepository) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.petTypeRepository = petTypeRepository;
        this.petBreedRepository = petBreedRepository;
        this.petVaccinationRepository = petVaccinationRepository;
    }

    @Transactional(readOnly = true)
    public List<PetTypeResponse> listPetTypes() {
        return petTypeRepository.findByIsActiveTrueOrderBySortOrderAscNameAsc()
                .stream()
                .map(type -> new PetTypeResponse(type.getId(), type.getCode(), type.getName(), type.getSortOrder()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PetBreedResponse> listBreeds(UUID petTypeId) {
        return petBreedRepository.findByPetType_IdAndIsActiveTrueOrderByNameAsc(petTypeId)
                .stream()
                .map(breed -> new PetBreedResponse(breed.getId(), breed.getPetType().getId(), breed.getName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PetResponse> listPets(UUID userId) {
        return petRepository.findByOwnerUser_IdAndDeletedAtIsNullOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toPetResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PetResponse getPet(UUID userId, UUID petId) {
        return toPetResponse(findOwnedPet(userId, petId));
    }

    @Transactional
    public PetResponse createPet(UUID userId, PetRequest request) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundExeption("Customer was not found"));
        PetType type = findActivePetType(request.petTypeId());
        PetBreed breed = findBreedForType(request.breedId(), type);
        validateMicrochip(request.microchipNumber(), null);

        Pet pet = Pet.builder()
                .ownerUser(owner)
                .petType(type)
                .breed(breed)
                .build();
        applyPet(pet, request, type, breed);
        return toPetResponse(petRepository.save(pet));
    }

    @Transactional
    public PetResponse updatePet(UUID userId, UUID petId, PetRequest request) {
        Pet pet = findOwnedPet(userId, petId);
        PetType type = findActivePetType(request.petTypeId());
        PetBreed breed = findBreedForType(request.breedId(), type);
        validateMicrochip(request.microchipNumber(), petId);
        applyPet(pet, request, type, breed);
        return toPetResponse(pet);
    }

    @Transactional
    public void deletePet(UUID userId, UUID petId) {
        Pet pet = findOwnedPet(userId, petId);
        pet.setDeletedAt(Instant.now());
    }

    @Transactional(readOnly = true)
    public List<VaccinationResponse> listVaccinations(UUID userId, UUID petId) {
        Pet pet = findOwnedPet(userId, petId);
        return petVaccinationRepository.findByPet_IdOrderByVaccinationDateDescCreatedAtDesc(pet.getId())
                .stream()
                .map(this::toVaccinationResponse)
                .toList();
    }

    private Pet findOwnedPet(UUID userId, UUID petId) {
        return petRepository.findByIdAndOwnerUser_IdAndDeletedAtIsNull(petId, userId)
                .orElseThrow(() -> new ResourceNotFoundExeption("Pet was not found"));
    }

    private PetType findActivePetType(UUID petTypeId) {
        PetType type = petTypeRepository.findById(petTypeId)
                .orElseThrow(() -> new BadRequestException("Pet type is invalid"));
        if (!Boolean.TRUE.equals(type.getIsActive())) {
            throw new BadRequestException("Pet type is inactive");
        }
        return type;
    }

    private PetBreed findBreedForType(UUID breedId, PetType type) {
        if (breedId == null) {
            return null;
        }
        PetBreed breed = petBreedRepository.findById(breedId)
                .orElseThrow(() -> new BadRequestException("Pet breed is invalid"));
        if (!Boolean.TRUE.equals(breed.getIsActive()) || !breed.getPetType().getId().equals(type.getId())) {
            throw new BadRequestException("Pet breed does not belong to the selected pet type");
        }
        return breed;
    }

    private void validateMicrochip(String microchipNumber, UUID currentPetId) {
        String value = blankToNull(microchipNumber);
        if (value == null) {
            return;
        }
        boolean exists = currentPetId == null
                ? petRepository.existsByMicrochipNumber(value)
                : petRepository.existsByMicrochipNumberAndIdNot(value, currentPetId);
        if (exists) {
            throw new BadRequestException("Microchip number is already registered");
        }
    }

    private void applyPet(Pet pet, PetRequest request, PetType type, PetBreed breed) {
        pet.setName(request.name().trim());
        pet.setPetType(type);
        pet.setBreed(breed);
        pet.setGender(blankToNull(request.gender()));
        pet.setBirthDate(request.birthDate());
        pet.setBirthDateEstimated(Boolean.TRUE.equals(request.birthDateEstimated()));
        pet.setWeightKg(request.weightKg());
        pet.setColor(blankToNull(request.color()));
        pet.setSterilized(request.sterilized());
        pet.setMicrochipNumber(blankToNull(request.microchipNumber()));
        pet.setProfileImageFileId(request.profileImageFileId());
        pet.setAllergies(blankToNull(request.allergies()));
        pet.setSpecialNotes(blankToNull(request.specialNotes()));
    }

    private PetResponse toPetResponse(Pet pet) {
        PetBreed breed = pet.getBreed();
        PetType type = pet.getPetType();
        return new PetResponse(
                pet.getId(),
                pet.getName(),
                type.getId(),
                type.getCode(),
                type.getName(),
                breed == null ? null : breed.getId(),
                breed == null ? null : breed.getName(),
                pet.getGender(),
                pet.getBirthDate(),
                pet.getBirthDateEstimated(),
                pet.getWeightKg(),
                pet.getColor(),
                pet.getSterilized(),
                pet.getMicrochipNumber(),
                pet.getProfileImageFileId(),
                pet.getAllergies(),
                pet.getSpecialNotes());
    }

    private VaccinationResponse toVaccinationResponse(PetVaccination vaccination) {
        return new VaccinationResponse(
                vaccination.getId(),
                vaccination.getPet().getId(),
                vaccination.getVaccineType() == null ? null : vaccination.getVaccineType().getId(),
                vaccination.getVaccineType() == null ? null : vaccination.getVaccineType().getName(),
                vaccination.getBookingId(),
                vaccination.getMerchantId(),
                vaccination.getBranchId(),
                vaccination.getVeterinarianStaffId(),
                vaccination.getVaccineNameSnapshot(),
                vaccination.getVaccinationDate(),
                vaccination.getNextVaccinationDate(),
                vaccination.getBatchNumber(),
                vaccination.getCertificateFileId(),
                vaccination.getNotes());
    }

    private static String blankToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}
