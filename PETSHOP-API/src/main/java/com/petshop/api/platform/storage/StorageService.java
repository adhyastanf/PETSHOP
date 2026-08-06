package com.petshop.api.platform.storage;

import java.io.InputStream;
import java.util.Optional;

/**
 * Platform abstraction for file/object storage.
 * Business modules depend on this interface, never on vendor SDKs.
 */
public interface StorageService {

    /**
     * Store content at the given path.
     *
     * @param path          logical path/key for the stored object
     * @param content       input stream of the file content
     * @param contentType   MIME type of the content
     * @param contentLength byte length of the content
     * @return the storage key/path that can be used to retrieve the file
     */
    String store(String path, InputStream content, String contentType, long contentLength);

    /**
     * Retrieve content by path.
     *
     * @param path logical path/key
     * @return the file bytes if found, empty otherwise
     */
    Optional<byte[]> retrieve(String path);

    /**
     * Delete content at the given path.
     *
     * @param path logical path/key
     */
    void delete(String path);

    /**
     * Get a publicly accessible URL for the stored content.
     *
     * @param path logical path/key
     * @return URL string
     */
    String getPublicUrl(String path);
}
