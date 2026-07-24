package com.petshop.api.auth.api;

import com.petshop.api.auth.api.dto.MeResponse;
import com.petshop.api.auth.domain.Role;
import com.petshop.api.auth.domain.User;
import com.petshop.api.auth.persistence.RoleRepository;
import com.petshop.api.auth.persistence.UserRepository;
import com.petshop.api.auth.security.SecurityContextUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Controller for the authenticated user's own profile.
 * Requires a valid Bearer token — returns 401 if unauthenticated.
 */
@RestController
@RequestMapping("/api/v1/me")
public class MeController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public MeController(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public ResponseEntity<MeResponse> me() {
        UUID userId = SecurityContextUtil.getCurrentUserId()
                .orElse(null);

        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<Role> roles = roleRepository.findRolesByUserId(userId);
        List<String> roleCodes = roles.stream()
                .map(Role::getCode)
                .toList();

        MeResponse response = new MeResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus().name(),
                roleCodes
        );

        return ResponseEntity.ok(response);
    }
}
