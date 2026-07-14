package com.petshop.api.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stock;
    private Boolean isActive;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
    private Integer soldCount;
    private String categoryName;
    private String petshopName;
    private Long petshopId;
    private Long categoryId;
}
