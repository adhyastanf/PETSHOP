package com.petshop.api.merchant.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateBranchRequest(
        @Size(max = 150) String name,
        @Size(max = 30) String phoneNumber,
        @Email @Size(max = 255) String email,
        String provinceName,
        String cityName,
        String districtName,
        String subdistrictName,
        String postalCode,
        String addressLine,
        BigDecimal latitude,
        BigDecimal longitude,
        Boolean isActive
) {}
