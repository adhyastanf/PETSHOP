package com.petshop.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petshop.api.dto.CategoryResponse;
import com.petshop.api.entity.Category;
import com.petshop.api.exception.ResourceNotFoundExeption;
import com.petshop.api.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getRootCategories() {
        return categoryRepository.findByParentIsNullOrderBySortOrder()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<CategoryResponse> getSubCategories(Long parentId) {
        return categoryRepository.findByParentIdOrderBySortOrder(parentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExeption("Category not found"));
        return toResponse(category);
    }

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .parentId(c.getParent() != null ? c.getParent().getId() : null)
                .iconUrl(c.getIconUrl())
                .sortOrder(c.getSortOrder())
                .build();
    }
}
