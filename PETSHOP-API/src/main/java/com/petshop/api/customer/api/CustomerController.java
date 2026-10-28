package com.petshop.api.customer.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.customer.api.dto.AddressDefaultRequest;
import com.petshop.api.customer.api.dto.AddressRequest;
import com.petshop.api.customer.api.dto.AddressResponse;
import com.petshop.api.customer.api.dto.CustomerProfileResponse;
import com.petshop.api.customer.api.dto.UpdateCustomerProfileRequest;
import com.petshop.api.customer.application.CustomerService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customer")
@PreAuthorize("hasAuthority('ROLE_CUSTOMER') or hasAuthority('ROLE_SUPER_ADMIN')")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/profile")
    public CustomerProfileResponse getProfile() {
        return customerService.getProfile(currentUserId());
    }

    @PatchMapping("/profile")
    public CustomerProfileResponse updateProfile(@Valid @RequestBody UpdateCustomerProfileRequest request) {
        return customerService.updateProfile(currentUserId(), request);
    }

    @GetMapping("/addresses")
    public List<AddressResponse> listAddresses() {
        return customerService.listAddresses(currentUserId());
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressResponse> createAddress(@Valid @RequestBody AddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerService.createAddress(currentUserId(), request));
    }

    @GetMapping("/addresses/{addressId}")
    public AddressResponse getAddress(@PathVariable UUID addressId) {
        return customerService.getAddress(currentUserId(), addressId);
    }

    @PatchMapping("/addresses/{addressId}")
    public AddressResponse updateAddress(
            @PathVariable UUID addressId,
            @Valid @RequestBody AddressRequest request) {
        return customerService.updateAddress(currentUserId(), addressId, request);
    }

    @PatchMapping("/addresses/{addressId}/default")
    public AddressResponse setDefault(
            @PathVariable UUID addressId,
            @Valid @RequestBody AddressDefaultRequest request) {
        return customerService.setDefault(currentUserId(), addressId, request);
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable UUID addressId) {
        customerService.deleteAddress(currentUserId(), addressId);
        return ResponseEntity.noContent().build();
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
