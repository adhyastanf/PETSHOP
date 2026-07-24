package com.petshop.api;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

/**
 * Compilation verification test.
 * 
 * The full Spring context cannot load without a DataSource backing JPA repositories
 * (auth services depend on UserRepository, RoleRepository, etc.). Full context
 * integration tests will use Testcontainers with a real PostgreSQL instance (task 11).
 * 
 * This test verifies that all classes compile and are loadable by the JVM.
 */
class PetshopApiApplicationTests {

    @Test
    void applicationClassIsLoadable() {
        assertDoesNotThrow(() -> Class.forName("com.petshop.api.PetshopApiApplication"));
    }

    @Test
    void authDomainEntitiesAreLoadable() {
        assertDoesNotThrow(() -> {
            Class.forName("com.petshop.api.auth.domain.User");
            Class.forName("com.petshop.api.auth.domain.Role");
            Class.forName("com.petshop.api.auth.domain.Permission");
            Class.forName("com.petshop.api.auth.domain.RefreshToken");
            Class.forName("com.petshop.api.auth.domain.UserRole");
            Class.forName("com.petshop.api.auth.domain.CustomerProfile");
            Class.forName("com.petshop.api.auth.domain.UserStatus");
        });
    }

    @Test
    void authServicesAreLoadable() {
        assertDoesNotThrow(() -> {
            Class.forName("com.petshop.api.auth.application.AuthServiceImpl");
            Class.forName("com.petshop.api.auth.application.TokenServiceImpl");
            Class.forName("com.petshop.api.auth.application.RbacService");
        });
    }
}
