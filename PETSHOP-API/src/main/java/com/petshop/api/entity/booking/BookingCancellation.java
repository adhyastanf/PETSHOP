package com.petshop.api.entity.booking;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.identity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "booking_cancellations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingCancellation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancelled_by", nullable = false)
    private User cancelledBy;

    @Column(name = "reason_code", nullable = false, length = 50)
    private String reasonCode;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "refundable_amount", precision = 19, scale = 2)
    private BigDecimal refundableAmount;

    @Column(name = "cancellation_fee", precision = 19, scale = 2)
    private BigDecimal cancellationFee;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
