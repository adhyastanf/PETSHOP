package com.petshop.api.entity.pet;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "pet_vaccinations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetVaccination extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vaccine_type_id")
    private VaccineType vaccineType;

    @Column(name = "booking_id")
    private UUID bookingId;

    @Column(name = "merchant_id")
    private UUID merchantId;

    @Column(name = "branch_id")
    private UUID branchId;

    @Column(name = "veterinarian_staff_id")
    private UUID veterinarianStaffId;

    @Column(name = "vaccine_name_snapshot", nullable = false, length = 150)
    private String vaccineNameSnapshot;

    @Column(name = "vaccination_date", nullable = false)
    private LocalDate vaccinationDate;

    @Column(name = "next_vaccination_date")
    private LocalDate nextVaccinationDate;

    @Column(name = "batch_number", length = 100)
    private String batchNumber;

    @Column(name = "certificate_file_id")
    private UUID certificateFileId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
