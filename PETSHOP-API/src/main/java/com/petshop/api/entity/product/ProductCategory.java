package com.petshop.api.entity.product;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "product_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategory extends BaseEntity {

    @Column(name = "parent_id")
    private UUID parentId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "slug", nullable = false, unique = true, length = 180)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_file_id")
    private UUID imageFileId;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
