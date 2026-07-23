package com.petshop.api.entity.cart;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.merchant.MerchantBranch;
import com.petshop.api.entity.pet.Pet;
import com.petshop.api.entity.service.ServiceEntity;
import com.petshop.api.entity.service.ServicePrice;
import com.petshop.api.entity.service.ServiceSlotHold;
import com.petshop.api.entity.staff.MerchantStaff;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "cart_service_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartServiceItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_price_id", nullable = false)
    private ServicePrice servicePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private MerchantStaff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_hold_id", nullable = false)
    private ServiceSlotHold slotHold;

    @Column(name = "scheduled_start_at", nullable = false)
    private Instant scheduledStartAt;

    @Column(name = "scheduled_end_at", nullable = false)
    private Instant scheduledEndAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
