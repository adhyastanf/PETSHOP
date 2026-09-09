package com.petshop.api.platform.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

/**
 * Local filesystem implementation of {@link StorageService}.
 * Stores files under ./storage/ directory. Suitable for local development only.
 */
@Slf4j
@Service
public class LocalStorageService implements StorageService {

    private static final Path BASE_DIR = Path.of("./storage").toAbsolutePath().normalize();

    @Override
    public String store(String path, InputStream content, String contentType, long contentLength) {
        Path target = resolveWithinBase(path);
        try {
            Files.createDirectories(target.getParent());
            Files.copy(content, target, StandardCopyOption.REPLACE_EXISTING);
            log.info("Stored file: {} ({}, {} bytes)", path, contentType, contentLength);
            return path;
        } catch (IOException e) {
            throw new StorageException("Failed to store file: " + path, e);
        }
    }

    @Override
    public Optional<byte[]> retrieve(String path) {
        Path target = resolveWithinBase(path);
        try {
            if (Files.exists(target)) {
                return Optional.of(Files.readAllBytes(target));
            }
            return Optional.empty();
        } catch (IOException e) {
            throw new StorageException("Failed to retrieve file: " + path, e);
        }
    }

    @Override
    public void delete(String path) {
        Path target = resolveWithinBase(path);
        try {
            Files.deleteIfExists(target);
            log.info("Deleted file: {}", path);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file: " + path, e);
        }
    }

    @Override
    public String getPublicUrl(String path) {
        return resolveWithinBase(path).toUri().toString();
    }

    /**
     * Resolves a logical path against the storage base directory and guarantees
     * the result stays inside it. Prevents path-traversal (e.g. {@code ../})
     * and absolute-path escapes regardless of the caller-supplied value.
     */
    private Path resolveWithinBase(String path) {
        if (path == null || path.isBlank()) {
            throw new StorageException("Storage path must not be blank", null);
        }
        Path resolved = BASE_DIR.resolve(path).normalize().toAbsolutePath();
        if (!resolved.startsWith(BASE_DIR)) {
            throw new StorageException("Illegal storage path (outside storage root): " + path, null);
        }
        return resolved;
    }

    /**
     * Runtime exception for storage I/O failures.
     */
    public static class StorageException extends RuntimeException {
        public StorageException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
