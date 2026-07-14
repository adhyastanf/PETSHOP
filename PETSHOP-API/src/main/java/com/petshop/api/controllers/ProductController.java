package com.petshop.api.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.petshop.api.dto.ProductResponse;
import com.petshop.api.service.ProductService;
import com.petshop.api.utils.ApiResponse;
import com.petshop.api.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAll(
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseUtil.ok(productService.getAllActive(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable Long id) {
        return ResponseUtil.ok(productService.getById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseUtil.ok(productService.getByCategory(categoryId, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> search(
            @RequestParam String q,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseUtil.ok(productService.search(q, pageable));
    }
}
