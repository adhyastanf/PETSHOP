package com.petshop.api.auth.security;

import com.petshop.api.auth.application.exception.InvalidTokenException;
import com.petshop.api.auth.application.TokenService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JWT authentication filter that intercepts every request once.
 * Extracts Bearer token from Authorization header, validates it,
 * and populates the SecurityContext with the authenticated principal.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final TokenService tokenService;

    public JwtAuthenticationFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        // If no Authorization header or not Bearer scheme, skip filter
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            Claims claims = tokenService.validateAccessToken(token);

            String userId = claims.getSubject();
            List<String> authorities = claims.get("authorities", List.class);

            List<SimpleGrantedAuthority> grantedAuthorities = (authorities != null)
                    ? authorities.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
                    : Collections.emptyList();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, grantedAuthorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (InvalidTokenException e) {
            // Token is expired, invalid, or tampered — clear context and let entry point handle 401
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
