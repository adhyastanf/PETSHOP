package com.petshop.api.entity.promotion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherServiceId implements Serializable {

    private UUID voucher;
    private UUID serviceId;
}
