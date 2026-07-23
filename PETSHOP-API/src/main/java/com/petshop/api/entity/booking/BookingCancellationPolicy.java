package com.petshop.api.entity.booking;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.service.ServiceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "booking_cancellation_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingCancellationPolicy extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    @Column(name = "min_hours_before", nullable = false)
    private Integer minHoursBefore;

    @Column(name = "max_hours_before")
    private Integer maxHoursBefore;

    @Column(name = "refund_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal refundPercentage;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
