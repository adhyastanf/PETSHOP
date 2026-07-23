package com.petshop.api.entity.staff;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MerchantStaffBranchId implements Serializable {

    private UUID staff;
    private UUID branch;
}
