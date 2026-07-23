package com.petshop.api.entity.promotion;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "voucher_product_categories")
@IdClass(VoucherProductCategoryId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherProductCategory {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;

    @Id
    @Column(name = "product_category_id", nullable = false)
    private UUID productCategoryId;
}
