package com.petshop.api.entity.review;

import com.petshop.api.auth.domain.User;
import com.petshop.api.entity.service.ServiceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "service_wishlists")
@IdClass(ServiceWishlistId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceWishlist {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
