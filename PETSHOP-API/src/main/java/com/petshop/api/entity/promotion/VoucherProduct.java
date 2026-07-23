package com.petshop.api.entity.promotion;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "voucher_products")
@IdClass(VoucherProductId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherProduct {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;

    @Id
    @Column(name = "product_id", nullable = false)
    private UUID productId;
}
