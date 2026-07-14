package com.petshop.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petshop.api.dto.PetshopResponse;
import com.petshop.api.entity.Petshop;
import com.petshop.api.exception.ResourceNotFoundExeption;
import com.petshop.api.repository.PetshopRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PetshopService {

    private final PetshopRepository petshopRepository;

    public List<PetshopResponse> getVerifiedPetshops() {
        return petshopRepository.findByIsVerifiedTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PetshopResponse getById(Long id) {
        Petshop petshop = petshopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExeption("Petshop not found"));
        return toResponse(petshop);
    }

    private PetshopResponse toResponse(Petshop p) {
        return PetshopResponse.builder()
                .id(p.getId())
                .shopName(p.getShopName())
                .description(p.getDescription())
                .address(p.getAddress())
                .city(p.getCity())
                .province(p.getProvince())
                .phone(p.getPhone())
                .logoUrl(p.getLogoUrl())
                .bannerUrl(p.getBannerUrl())
                .isVerified(p.getIsVerified())
                .ratingAvg(p.getRatingAvg())
                .ratingCount(p.getRatingCount())
                .build();
    }
}
