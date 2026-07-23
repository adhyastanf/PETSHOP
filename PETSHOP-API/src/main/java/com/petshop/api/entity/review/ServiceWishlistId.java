package com.petshop.api.entity.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceWishlistId implements Serializable {

    private UUID user;
    private UUID service;
}
