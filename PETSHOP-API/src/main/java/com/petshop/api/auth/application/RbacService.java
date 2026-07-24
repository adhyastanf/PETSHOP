package com.petshop.api.auth.application;

import org.springframework.security.core.GrantedAuthority;

import java.util.Set;
import java.util.UUID;

/**
 * Service responsible for loading user roles and permissions
 * and mapping them to Spring Security granted authorities.
 */
public interface RbacService {

    /**
     * Loads all granted authorities for the given user.
     * Each role is mapped to ROLE_{code} and each permission to PERM_{code}.
     *
     * @param userId the user's UUID
     * @return union set of GrantedAuthority; empty set if user has no roles
     */
    Set<GrantedAuthority> loadAuthorities(UUID userId);
}
