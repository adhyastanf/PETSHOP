package com.petshop.api.businessconfig.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request to update a managed business configuration value.
 * The value is provided as text and validated/typed server-side against the
 * managed key definition.
 */
public record UpdateSystemConfigRequest(
        @NotBlank @Size(max = 100) String value
) {
}
