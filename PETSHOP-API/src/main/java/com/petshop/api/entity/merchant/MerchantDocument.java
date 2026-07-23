package com.petshop.api.entity.merchant;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "merchant_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @Column(name = "document_type", nullable = false, length = 50)
    private String documentType;

    @Column(name = "document_number", length = 100)
    private String documentNumber;

    @Column(name = "file_id", nullable = false)
    private UUID fileId;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "expires_at")
    private LocalDate expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
