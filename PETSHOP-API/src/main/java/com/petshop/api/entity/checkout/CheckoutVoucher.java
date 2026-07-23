package com.petshop.api.entity.checkout;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "checkout_vouchers")
@IdClass(CheckoutVoucherId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutVoucher {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checkout_id", nullable = false)
    private Checkout checkout;

    @Id
    @Column(name = "voucher_id", nullable = false)
    private UUID voucherId;

    @Column(name = "discount_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal discountAmount;
}
