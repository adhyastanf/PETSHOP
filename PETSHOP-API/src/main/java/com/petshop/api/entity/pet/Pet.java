package com.petshop.api.entity.pet;

import com.petshop.api.entity.base.AuditableEntity;
import com.petshop.api.entity.identity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User ownerUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_type_id", nullable = false)
    private PetType petType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breed_id")
    private PetBreed breed;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "birth_date_estimated")
    private Boolean birthDateEstimated;

    @Column(name = "weight_kg", precision = 7, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "color", length = 100)
    private String color;

    @Column(name = "sterilized")
    private Boolean sterilized;

    @Column(name = "microchip_number", unique = true, length = 100)
    private String microchipNumber;

    @Column(name = "profile_image_file_id")
    private UUID profileImageFileId;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "special_notes", columnDefinition = "TEXT")
    private String specialNotes;
}
