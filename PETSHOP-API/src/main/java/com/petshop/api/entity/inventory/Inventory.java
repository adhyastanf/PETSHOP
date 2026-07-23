package com.petshop.api.entity.inventory;

import com.petshop.api.entity.base.BaseEntity;
import com.petshop.api.entity.merchant.MerchantBranch;
import com.petshop.api.entity.product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "inventories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private MerchantBranch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "quantity_on_hand", nullable = false)
    private Integer quantityOnHand;

    @Column(name = "quantity_reserved", nullable = false)
    private Integer quantityReserved;

    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
