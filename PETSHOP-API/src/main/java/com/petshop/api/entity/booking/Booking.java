package com.petshop.api.entity.booking;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.checkout.Checkout;
import com.petshop.api.auth.domain.User;
import com.petshop.api.entity.merchant.Merchant;
import com.petshop.api.entity.merchant.MerchantBranch;
import com.petshop.api.entity.pet.Pet;
import com.petshop.api.entity.service.ServiceEntity;
import com.petshop.api.entity.service.ServicePrice;
import com.petshop.api.entity.staff.MerchantStaff;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @Column(name = "booking_number", nullable = false, unique = true, length = 50)
    private String bookingNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checkout_id", nullable = false)
    private Checkout checkout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_price_id")
    private ServicePrice servicePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private MerchantStaff staff;

    @Column(name = "service_name_snapshot", length = 255)
    private String serviceNameSnapshot;

    @Column(name = "service_duration_snapshot")
    private Integer serviceDurationSnapshot;

    @Column(name = "price_label_snapshot", length = 150)
    private String priceLabelSnapshot;

    @Column(name = "price_amount_snapshot", precision = 19, scale = 2)
    private BigDecimal priceAmountSnapshot;

    @Column(name = "subtotal", nullable = false, precision = 19, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount_amount", precision = 19, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "platform_fee", precision = 19, scale = 2)
    private BigDecimal platformFee;

    @Column(name = "total", nullable = false, precision = 19, scale = 2)
    private BigDecimal total;

    @Column(name = "confirmation_mode_snapshot", length = 30)
    private String confirmationModeSnapshot;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "scheduled_start_at")
    private Instant scheduledStartAt;

    @Column(name = "scheduled_end_at")
    private Instant scheduledEndAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
