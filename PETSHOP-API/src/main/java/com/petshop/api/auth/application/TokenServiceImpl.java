package com.petshop.api.auth.application;

import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.auth.application.exception.InvalidTokenException;
import com.petshop.api.auth.config.AuthProperties;
import com.petshop.api.auth.domain.RefreshToken;
import com.petshop.api.auth.domain.User;
import com.petshop.api.auth.persistence.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of {@link TokenService} handling JWT access tokens
 * and refresh token lifecycle with rotation and replay detection.
 */
@Service
public class TokenServiceImpl implements TokenService {

    private final AuthProperties authProperties;
    private final RbacService rbacService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final SecureRandom secureRandom;
    private final SecretKey signingKey;

    public TokenServiceImpl(AuthProperties authProperties,
                            RbacService rbacService,
                            RefreshTokenRepository refreshTokenRepository) {
        this.authProperties = authProperties;
        this.rbacService = rbacService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.secureRandom = new SecureRandom();
        this.signingKey = Keys.hmacShaKeyFor(
                authProperties.jwt().secret().getBytes(StandardCharsets.UTF_8));
    }

    @Override
    @Transactional
    public AuthResponse generateTokenPair(User user) {
        Set<GrantedAuthority> authorities = rbacService.loadAuthorities(user.getId());
        String accessToken = generateAccessToken(user, authorities);
        String rawRefreshToken = createAndPersistRefreshToken(user);

        return new AuthResponse(
                user.getId(),
                accessToken,
                rawRefreshToken,
                "Bearer",
                authProperties.jwt().accessTokenExpiry()
        );
    }

    @Override
    public Claims validateAccessToken(String jwt) {
        try {
            return Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(jwt)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidTokenException("Invalid or expired access token", e);
        }
    }

    @Override
    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        String tokenHash = computeSha256(rawRefreshToken);

        RefreshToken existingToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        // Replay detection: if token is already revoked, revoke ALL active tokens for this user
        if (existingToken.getRevokedAt() != null) {
            refreshTokenRepository.revokeAllActiveTokensByUserId(
                    existingToken.getUser().getId(), Instant.now());
            throw new InvalidTokenException("Refresh token has been revoked (replay detected)");
        }

        // Check expiration
        if (existingToken.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidTokenException("Refresh token has expired");
        }

        User user = existingToken.getUser();

        // Rotate: create new refresh token
        String newRawRefreshToken = createAndPersistRefreshToken(user);

        // Find the newly created token to get its ID for traceability
        String newTokenHash = computeSha256(newRawRefreshToken);
        RefreshToken newToken = refreshTokenRepository.findByTokenHash(newTokenHash)
                .orElseThrow(() -> new IllegalStateException("Newly created refresh token not found"));

        // Revoke old token and link to replacement
        existingToken.setRevokedAt(Instant.now());
        existingToken.setReplacedById(newToken.getId());
        refreshTokenRepository.save(existingToken);

        // Generate fresh access token with current authorities
        Set<GrantedAuthority> authorities = rbacService.loadAuthorities(user.getId());
        String accessToken = generateAccessToken(user, authorities);

        return new AuthResponse(
                user.getId(),
                accessToken,
                newRawRefreshToken,
                "Bearer",
                authProperties.jwt().accessTokenExpiry()
        );
    }

    @Override
    @Transactional
    public void revokeRefreshToken(UUID userId, String rawRefreshToken) {
        String tokenHash = computeSha256(rawRefreshToken);

        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);

        // Not found → return silently (idempotent)
        if (tokenOpt.isEmpty()) {
            return;
        }

        RefreshToken token = tokenOpt.get();

        // Already revoked → return silently (idempotent)
        if (token.getRevokedAt() != null) {
            return;
        }

        // Cross-user prevention: if token doesn't belong to the authenticated user, return silently
        if (!token.getUser().getId().equals(userId)) {
            return;
        }

        // Revoke the token
        token.setRevokedAt(Instant.now());
        refreshTokenRepository.save(token);
    }

    // --- Private helper methods ---

    private String generateAccessToken(User user, Set<GrantedAuthority> authorities) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(authProperties.jwt().accessTokenExpiry());

        List<String> authorityStrings = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("authorities", authorityStrings)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    private String createAndPersistRefreshToken(User user) {
        // Generate 32 bytes of cryptographic randomness
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        // Base64URL encode the raw token
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        // Compute SHA-256 hash for storage
        String tokenHash = computeSha256(rawToken);

        // Persist the token entity
        Instant expiresAt = Instant.now().plusSeconds(authProperties.jwt().refreshTokenExpiry());
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .build();

        refreshTokenRepository.save(refreshToken);

        // Return the raw token (only the client holds it)
        return rawToken;
    }

    private String computeSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
