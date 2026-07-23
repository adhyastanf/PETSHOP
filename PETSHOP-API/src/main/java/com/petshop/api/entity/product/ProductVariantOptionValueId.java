package com.petshop.api.entity.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantOptionValueId implements Serializable {

    private UUID variant;
    private UUID optionValue;
}
