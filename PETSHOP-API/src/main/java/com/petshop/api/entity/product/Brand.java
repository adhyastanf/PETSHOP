package com.petshop.api.entity.product;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "brands")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 150)
    private String name;

    @Column(name = "slug", nullable = false, unique = true, length = 180)
    private String slug;

    @Column(name = "logo_file_id")
    private UUID logoFileId;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
