package com.petshop.api.merchant.api.dto;

public record UpdateStaffRequest(
        String status,
        String displayName
) {}
