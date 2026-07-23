package com.petshop.api.entity.checkout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutVoucherId implements Serializable {

    private UUID checkout;
    private UUID voucherId;
}
