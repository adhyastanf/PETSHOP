package com.petshop.api.entity.merchant;

import com.petshop.api.entity.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "merchant_branches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantBranch extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "province_code", length = 10)
    private String provinceCode;

    @Column(name = "province_name", length = 100)
    private String provinceName;

    @Column(name = "city_code", length = 10)
    private String cityCode;

    @Column(name = "city_name", length = 100)
    private String cityName;

    @Column(name = "district_code", length = 10)
    private String districtCode;

    @Column(name = "district_name", length = 100)
    private String districtName;

    @Column(name = "subdistrict_code", length = 10)
    private String subdistrictCode;

    @Column(name = "subdistrict_name", length = 100)
    private String subdistrictName;

    @Column(name = "postal_code", length = 10)
    private String postalCode;

    @Column(name = "address_line", columnDefinition = "TEXT")
    private String addressLine;

    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
