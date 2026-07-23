package com.petshop.api.entity.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceBranchId implements Serializable {

    private UUID service;
    private UUID branch;
}
