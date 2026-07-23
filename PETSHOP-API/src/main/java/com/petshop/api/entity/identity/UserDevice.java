package com.petshop.api.entity.identity;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_devices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDevice extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "device_identifier", nullable = false, length = 255)
    private String deviceIdentifier;

    @Column(name = "platform", nullable = false, length = 30)
    private String platform;

    @Column(name = "device_name", length = 255)
    private String deviceName;

    @Column(name = "push_token", columnDefinition = "TEXT")
    private String pushToken;

    @Column(name = "last_active_at")
    private Instant lastActiveAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
