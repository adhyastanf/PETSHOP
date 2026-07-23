package com.petshop.api.entity.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceStaffId implements Serializable {

    private UUID service;
    private UUID staff;
    private UUID branch;
}
