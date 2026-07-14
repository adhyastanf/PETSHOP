package com.petshop.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.petshop.api.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParentIsNullOrderBySortOrder();

    List<Category> findByParentIdOrderBySortOrder(Long parentId);

    Optional<Category> findBySlug(String slug);
}
