package com.petshop.api.entity.pet;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "pet_breeds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetBreed extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_type_id", nullable = false)
    private PetType petType;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
