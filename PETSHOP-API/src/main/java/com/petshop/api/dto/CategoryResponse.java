package com.petshop.api.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private Long parentId;
    private String iconUrl;
    private Integer sortOrder;
}
