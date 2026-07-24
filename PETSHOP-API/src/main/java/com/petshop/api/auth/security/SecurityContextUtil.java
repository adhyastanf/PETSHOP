package com.petshop.api.auth.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

/**
 * Static utility for extracting the current authenticated user's ID from the SecurityContext.
 * The JwtAuthenticationFilter sets the principal as the userId string (UUID).
 */
public final class SecurityContextUtil {

    private SecurityContextUtil() {
        // Utility class — no instantiation
    }

    /**
     * Returns the current authenticated user's UUID, or Optional.empty() if
     * no user is authenticated or the principal is not a valid UUID string.
     */
    public static Optional<UUID> getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return Optional.empty();
        }

        Object principal = auth.getPrincipal();

        // Handle "anonymousUser" string set by Spring Security for unauthenticated requests
        if (principal instanceof String userIdStr) {
            if ("anonymousUser".equals(userIdStr)) {
                return Optional.empty();
            }
            try {
                return Optional.of(UUID.fromString(userIdStr));
            } catch (IllegalArgumentException e) {
                return Optional.empty();
            }
        }

        return Optional.empty();
    }
}
