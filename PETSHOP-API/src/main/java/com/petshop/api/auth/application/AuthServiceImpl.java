package com.petshop.api.auth.application;

import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.auth.api.dto.LoginRequest;
import com.petshop.api.auth.api.dto.RegisterRequest;
import com.petshop.api.auth.application.exception.*;
import com.petshop.api.auth.domain.*;
import com.petshop.api.auth.persistence.CustomerProfileRepository;
import com.petshop.api.auth.persistence.RoleRepository;
import com.petshop.api.auth.persistence.UserRepository;
import com.petshop.api.auth.persistence.UserRoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Implementation of AuthService handling registration and login orchestration.
 */
@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           UserRoleRepository userRoleRepository,
                           CustomerProfileRepository customerProfileRepository,
                           PasswordEncoder passwordEncoder,
                           TokenService tokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        // 1. Validate uniqueness
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException();
        }
        if (request.phoneNumber() != null && !request.phoneNumber().isBlank()
                && userRepository.existsByPhoneNumber(request.phoneNumber())) {
            throw new DuplicatePhoneException();
        }

        // 2. Hash password with BCrypt
        String passwordHash = passwordEncoder.encode(request.password());

        // 3. Create User entity with status ACTIVE
        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .passwordHash(passwordHash)
                .status(UserStatus.ACTIVE)
                .build();
        user = userRepository.save(user);

        // 4. Assign CUSTOMER role
        Role customerRole = roleRepository.findByCode("CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("CUSTOMER role not found in database"));

        UserRole userRole = UserRole.builder()
                .user(user)
                .role(customerRole)
                .build();
        userRoleRepository.save(userRole);

        // 5. Create CustomerProfile record
        CustomerProfile profile = CustomerProfile.builder()
                .user(user)
                .build();
        customerProfileRepository.save(profile);

        // 6. Generate token pair
        return tokenService.generateTokenPair(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // 1. Find user by email
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        // 2. Verify password
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        // 3. Check user status
        switch (user.getStatus()) {
            case SUSPENDED -> throw new AccountSuspendedException();
            case INACTIVE -> throw new AccountInactiveException();
            case BLOCKED -> throw new AccountBlockedException();
            case ACTIVE -> { /* proceed */ }
        }

        // 4. Update lastLoginAt
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        // 5. Generate token pair
        return tokenService.generateTokenPair(user);
    }
}
