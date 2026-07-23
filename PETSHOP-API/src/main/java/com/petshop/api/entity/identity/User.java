package com.petshop.api.entity.identity;

import com.petshop.api.entity.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends AuditableEntity {

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "email", length = 255, unique = true)
    private String email;

    @Column(name = "phone_number", length = 30, unique = true)
    private String phoneNumber;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "profile_image_file_id")
    private UUID profileImageFileId;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "email_verified_at")
    private Instant emailVerifiedAt;

    @Column(name = "phone_verified_at")
    private Instant phoneVerifiedAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;
}
