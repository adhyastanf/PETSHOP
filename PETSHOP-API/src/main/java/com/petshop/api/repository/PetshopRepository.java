package com.petshop.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.petshop.api.entity.Petshop;

public interface PetshopRepository extends JpaRepository<Petshop, Long> {

    List<Petshop> findByIsVerifiedTrue();

    List<Petshop> findByCity(String city);
}
