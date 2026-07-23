package com.petshop.api.entity.promotion;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "file_id", nullable = false)
    private UUID fileId;

    @Column(name = "target_type", length = 30)
    private String targetType;

    @Column(name = "target_value", columnDefinition = "TEXT")
    private String targetValue;

    @Column(name = "placement", length = 50)
    private String placement;

    @Column(name = "start_at")
    private Instant startAt;

    @Column(name = "end_at")
    private Instant endAt;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
