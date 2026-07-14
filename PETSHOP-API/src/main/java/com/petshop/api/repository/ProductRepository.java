package com.petshop.api.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.petshop.api.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    List<Product> findByPetshopIdAndIsActiveTrue(Long petshopId);

    Page<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String keyword, Pageable pageable);
}
