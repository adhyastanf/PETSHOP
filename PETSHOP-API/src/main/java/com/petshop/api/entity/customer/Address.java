package com.petshop.api.entity.customer;

import com.petshop.api.entity.base.AuditableEntity;
import com.petshop.api.auth.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "label", length = 100)
    private String label;

    @Column(name = "recipient_name", length = 150)
    private String recipientName;

    @Column(name = "recipient_phone", length = 30)
    private String recipientPhone;

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

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault;
}
