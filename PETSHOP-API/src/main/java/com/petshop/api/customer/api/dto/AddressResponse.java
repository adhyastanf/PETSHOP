package com.petshop.api.customer.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record AddressResponse(
        UUID id,
        String label,
        String recipientName,
        String recipientPhone,
        String provinceCode,
        String provinceName,
        String cityCode,
        String cityName,
        String districtCode,
        String districtName,
        String subdistrictCode,
        String subdistrictName,
        String postalCode,
        String addressLine,
        BigDecimal latitude,
        BigDecimal longitude,
        String notes,
        Boolean isDefault
) {
}
