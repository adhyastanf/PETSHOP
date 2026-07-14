package com.petshop.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.petshop.api.dto.CategoryResponse;
import com.petshop.api.service.CategoryService;
import com.petshop.api.utils.ApiResponse;
import com.petshop.api.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getRootCategories() {
        return ResponseUtil.ok(categoryService.getRootCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getById(@PathVariable Long id) {
        return ResponseUtil.ok(categoryService.getById(id));
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getSubCategories(@PathVariable Long id) {
        return ResponseUtil.ok(categoryService.getSubCategories(id));
    }
}
