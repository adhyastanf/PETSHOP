package com.petshop.api.entity.staff;

import com.petshop.api.entity.identity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "veterinarian_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VeterinarianProfile {

    @Id
    @Column(name = "staff_id")
    private UUID staffId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "staff_id")
    private MerchantStaff staff;

    @Column(name = "license_number", length = 150)
    private String licenseNumber;

    @Column(name = "license_file_id")
    private UUID licenseFileId;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
