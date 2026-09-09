package com.petshop.api.platform.storage;

import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests for {@link LocalStorageService} path containment (security hardening).
 * These tests do not require Docker/Testcontainers.
 */
class LocalStorageServiceTest {

    private final LocalStorageService service = new LocalStorageService();

    private InputStream content(String text) {
        return new ByteArrayInputStream(text.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void storesAndRetrievesFileWithinStorageRoot() {
        String key = "test/hardening/sample.txt";
        service.store(key, content("hello"), "text/plain", 5);

        Optional<byte[]> data = service.retrieve(key);
        assertThat(data).isPresent();
        assertThat(new String(data.get(), StandardCharsets.UTF_8)).isEqualTo("hello");

        service.delete(key);
        assertThat(service.retrieve(key)).isEmpty();
    }

    @Test
    void rejectsParentDirectoryTraversalOnStore() {
        assertThatThrownBy(() ->
                service.store("../../etc/evil.txt", content("x"), "text/plain", 1))
                .isInstanceOf(LocalStorageService.StorageException.class);
    }

    @Test
    void rejectsParentDirectoryTraversalOnRetrieve() {
        assertThatThrownBy(() -> service.retrieve("../../../secret.txt"))
                .isInstanceOf(LocalStorageService.StorageException.class);
    }

    @Test
    void rejectsParentDirectoryTraversalOnDelete() {
        assertThatThrownBy(() -> service.delete("../outside.txt"))
                .isInstanceOf(LocalStorageService.StorageException.class);
    }

    @Test
    void rejectsBlankPath() {
        assertThatThrownBy(() -> service.retrieve("  "))
                .isInstanceOf(LocalStorageService.StorageException.class);
    }
}
