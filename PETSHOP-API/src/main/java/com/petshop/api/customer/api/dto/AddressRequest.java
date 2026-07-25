package com.petshop.api.customer.api.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record AddressRequest(
        @Size(max = 100) String label,
        @NotBlank @Size(max = 150) String recipientName,
        @NotBlank @Size(max = 30) String recipientPhone,
        @Size(max = 10) String provinceCode,
        @Size(max = 100) String provinceName,
        @Size(max = 10) String cityCode,
        @Size(max = 100) String cityName,
        @Size(max = 10) String districtCode,
        @Size(max = 100) String districtName,
        @Size(max = 10) String subdistrictCode,
        @Size(max = 100) String subdistrictName,
        @NotBlank @Size(max = 10) String postalCode,
        @NotBlank @Size(max = 2000) String addressLine,
        @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude,
        @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude,
        @Size(max = 500) String notes,
        Boolean isDefault
) {
}
