package com.petshop.api.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AuthProperties(
    JwtProperties jwt,
    CorsProperties cors
) {
    public record JwtProperties(String secret, long accessTokenExpiry, long refreshTokenExpiry) {}
    public record CorsProperties(String allowedOrigins) {}
}
