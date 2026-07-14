package com.petshop.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.petshop.api.dto.PetshopResponse;
import com.petshop.api.service.PetshopService;
import com.petshop.api.utils.ApiResponse;
import com.petshop.api.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/petshops")
@RequiredArgsConstructor
public class PetshopController {

    private final PetshopService petshopService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PetshopResponse>>> getVerified() {
        return ResponseUtil.ok(petshopService.getVerifiedPetshops());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetshopResponse>> getById(@PathVariable Long id) {
        return ResponseUtil.ok(petshopService.getById(id));
    }
}
