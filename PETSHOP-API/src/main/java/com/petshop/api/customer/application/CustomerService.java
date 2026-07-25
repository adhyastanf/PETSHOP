package com.petshop.api.customer.application;

import com.petshop.api.auth.domain.CustomerProfile;
import com.petshop.api.auth.domain.User;
import com.petshop.api.auth.persistence.CustomerProfileRepository;
import com.petshop.api.auth.persistence.UserRepository;
import com.petshop.api.customer.api.dto.AddressDefaultRequest;
import com.petshop.api.customer.api.dto.AddressRequest;
import com.petshop.api.customer.api.dto.AddressResponse;
import com.petshop.api.customer.api.dto.CustomerProfileResponse;
import com.petshop.api.customer.api.dto.UpdateCustomerProfileRequest;
import com.petshop.api.customer.persistence.AddressRepository;
import com.petshop.api.entity.customer.Address;
import com.petshop.api.exception.BadRequestException;
import com.petshop.api.exception.ResourceNotFoundExeption;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final AddressRepository addressRepository;

    public CustomerService(
            UserRepository userRepository,
            CustomerProfileRepository customerProfileRepository,
            AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional(readOnly = true)
    public CustomerProfileResponse getProfile(UUID userId) {
        User user = findUser(userId);
        CustomerProfile profile = customerProfileRepository.findById(userId).orElse(null);
        return toProfileResponse(user, profile);
    }

    @Transactional
    public CustomerProfileResponse updateProfile(UUID userId, UpdateCustomerProfileRequest request) {
        User user = findUser(userId);
        if (hasText(request.fullName())) {
            user.setFullName(request.fullName().trim());
        }
        if (request.phoneNumber() != null) {
            String phone = blankToNull(request.phoneNumber());
            if (phone != null && !phone.equals(user.getPhoneNumber()) && userRepository.existsByPhoneNumber(phone)) {
                throw new BadRequestException("Phone number is already registered");
            }
            user.setPhoneNumber(phone);
        }
        if (request.profileImageFileId() != null) {
            user.setProfileImageFileId(request.profileImageFileId());
        }

        CustomerProfile profile = customerProfileRepository.findById(userId)
                .orElseGet(() -> CustomerProfile.builder()
                        .user(user)
                        .gender(null)
                        .birthDate(null)
                        .build());
        profile.setGender(blankToNull(request.gender()));
        profile.setBirthDate(request.birthDate());
        customerProfileRepository.save(profile);
        return toProfileResponse(user, profile);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> listAddresses(UUID userId) {
        return addressRepository.findByUser_IdAndDeletedAtIsNullOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toAddressResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AddressResponse getAddress(UUID userId, UUID addressId) {
        return toAddressResponse(findOwnedAddress(userId, addressId));
    }

    @Transactional
    public AddressResponse createAddress(UUID userId, AddressRequest request) {
        User user = findUser(userId);
        boolean firstAddress = !addressRepository.existsByUser_IdAndDeletedAtIsNull(userId);
        boolean makeDefault = Boolean.TRUE.equals(request.isDefault()) || firstAddress;
        if (makeDefault) {
            addressRepository.clearDefaultForUser(userId, null);
        }

        Address address = Address.builder()
                .user(user)
                .isDefault(makeDefault)
                .build();
        applyAddress(address, request);
        return toAddressResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(UUID userId, UUID addressId, AddressRequest request) {
        Address address = findOwnedAddress(userId, addressId);
        boolean makeDefault = Boolean.TRUE.equals(request.isDefault());
        if (makeDefault) {
            addressRepository.clearDefaultForUser(userId, addressId);
        }
        applyAddress(address, request);
        address.setIsDefault(makeDefault);
        return toAddressResponse(address);
    }

    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        Address address = findOwnedAddress(userId, addressId);
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        address.setDeletedAt(Instant.now());
        address.setIsDefault(false);
        if (wasDefault) {
            addressRepository.findByUser_IdAndDeletedAtIsNullOrderByCreatedAtDesc(userId)
                    .stream()
                    .filter(candidate -> !candidate.getId().equals(addressId))
                    .findFirst()
                    .ifPresent(next -> next.setIsDefault(true));
        }
    }

    @Transactional
    public AddressResponse setDefault(UUID userId, UUID addressId, AddressDefaultRequest request) {
        Address address = findOwnedAddress(userId, addressId);
        if (Boolean.TRUE.equals(request.isDefault())) {
            addressRepository.clearDefaultForUser(userId, addressId);
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }
        return toAddressResponse(address);
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundExeption("Customer was not found"));
    }

    private Address findOwnedAddress(UUID userId, UUID addressId) {
        return addressRepository.findByIdAndUser_IdAndDeletedAtIsNull(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundExeption("Address was not found"));
    }

    private void applyAddress(Address address, AddressRequest request) {
        address.setLabel(blankToNull(request.label()));
        address.setRecipientName(request.recipientName().trim());
        address.setRecipientPhone(request.recipientPhone().trim());
        address.setProvinceCode(blankToNull(request.provinceCode()));
        address.setProvinceName(blankToNull(request.provinceName()));
        address.setCityCode(blankToNull(request.cityCode()));
        address.setCityName(blankToNull(request.cityName()));
        address.setDistrictCode(blankToNull(request.districtCode()));
        address.setDistrictName(blankToNull(request.districtName()));
        address.setSubdistrictCode(blankToNull(request.subdistrictCode()));
        address.setSubdistrictName(blankToNull(request.subdistrictName()));
        address.setPostalCode(request.postalCode().trim());
        address.setAddressLine(request.addressLine().trim());
        address.setLatitude(request.latitude());
        address.setLongitude(request.longitude());
        address.setNotes(blankToNull(request.notes()));
    }

    private CustomerProfileResponse toProfileResponse(User user, CustomerProfile profile) {
        return new CustomerProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getProfileImageFileId(),
                profile == null ? null : profile.getGender(),
                profile == null ? null : profile.getBirthDate());
    }

    private AddressResponse toAddressResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLabel(),
                address.getRecipientName(),
                address.getRecipientPhone(),
                address.getProvinceCode(),
                address.getProvinceName(),
                address.getCityCode(),
                address.getCityName(),
                address.getDistrictCode(),
                address.getDistrictName(),
                address.getSubdistrictCode(),
                address.getSubdistrictName(),
                address.getPostalCode(),
                address.getAddressLine(),
                address.getLatitude(),
                address.getLongitude(),
                address.getNotes(),
                address.getIsDefault());
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private static String blankToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}
