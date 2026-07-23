package com.petshop.api.entity.review;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "review_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewMedia extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(name = "file_id", nullable = false)
    private UUID fileId;

    @Column(name = "media_type", nullable = false, length = 20)
    private String mediaType;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
