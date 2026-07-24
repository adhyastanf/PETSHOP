package com.petshop.api.entity.checkout;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.cart.Cart;
import com.petshop.api.auth.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "checkouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Checkout extends BaseEntity {

    @Column(name = "checkout_number", nullable = false, unique = true, length = 50)
    private String checkoutNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "product_subtotal", precision = 19, scale = 2)
    private BigDecimal productSubtotal;

    @Column(name = "service_subtotal", precision = 19, scale = 2)
    private BigDecimal serviceSubtotal;

    @Column(name = "shipping_total", precision = 19, scale = 2)
    private BigDecimal shippingTotal;

    @Column(name = "platform_fee", precision = 19, scale = 2)
    private BigDecimal platformFee;

    @Column(name = "discount_total", precision = 19, scale = 2)
    private BigDecimal discountTotal;

    @Column(name = "grand_total", precision = 19, scale = 2)
    private BigDecimal grandTotal;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
