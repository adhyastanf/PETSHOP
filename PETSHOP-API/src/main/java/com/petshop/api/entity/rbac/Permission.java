package com.petshop.api.entity.rbac;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "module", nullable = false, length = 100)
    private String module;

    @Column(name = "description", length = 255)
    private String description;
}
