package com.petshop.api.entity.rbac;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleId implements Serializable {

    private UUID user;
    private UUID role;
}
