package com.petshop.api.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petshop.api.dto.ProductResponse;
import com.petshop.api.entity.Product;
import com.petshop.api.exception.ResourceNotFoundExeption;
import com.petshop.api.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public Page<ProductResponse> getAllActive(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable)
                .map(this::toResponse);
    }

    public Page<ProductResponse> getByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable)
                .map(this::toResponse);
    }

    public Page<ProductResponse> search(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(keyword, pageable)
                .map(this::toResponse);
    }

    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExeption("Product not found"));
        return toResponse(product);
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .price(p.getPrice())
                .discountPrice(p.getDiscountPrice())
                .stock(p.getStock())
                .isActive(p.getIsActive())
                .ratingAvg(p.getRatingAvg())
                .ratingCount(p.getRatingCount())
                .soldCount(p.getSoldCount())
                .categoryName(p.getCategory().getName())
                .categoryId(p.getCategory().getId())
                .petshopName(p.getPetshop().getShopName())
                .petshopId(p.getPetshop().getId())
                .build();
    }
}
