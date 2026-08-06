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

    private static final Path BASE_DIR = Path.of("./storage");

    @Override
    public String store(String path, InputStream content, String contentType, long contentLength) {
        try {
            Path target = BASE_DIR.resolve(path).normalize();
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
        try {
            Path target = BASE_DIR.resolve(path).normalize();
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
        try {
            Path target = BASE_DIR.resolve(path).normalize();
            Files.deleteIfExists(target);
            log.info("Deleted file: {}", path);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file: " + path, e);
        }
    }

    @Override
    public String getPublicUrl(String path) {
        Path target = BASE_DIR.resolve(path).normalize().toAbsolutePath();
        return target.toUri().toString();
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
