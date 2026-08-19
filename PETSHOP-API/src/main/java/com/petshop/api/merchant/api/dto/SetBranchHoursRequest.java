package com.petshop.api.merchant.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record SetBranchHoursRequest(
        @NotNull @Valid List<DayHours> hours
) {}
