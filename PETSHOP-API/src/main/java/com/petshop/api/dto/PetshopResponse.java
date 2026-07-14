package com.petshop.api.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetshopResponse {
    private Long id;
    private String shopName;
    private String description;
    private String address;
    private String city;
    private String province;
    private String phone;
    private String logoUrl;
    private String bannerUrl;
    private Boolean isVerified;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
}
