package com.petshop.api.entity.promotion;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "voucher_services")
@IdClass(VoucherServiceId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherService {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;

    @Id
    @Column(name = "service_id", nullable = false)
    private UUID serviceId;
}
