package com.petshop.api.platform.image;

/**
 * Platform abstraction for image processing operations.
 * Business modules depend on this interface, never on vendor SDKs.
 */
public interface ImageService {

    /**
     * Resize an image to exact dimensions.
     *
     * @param imageData raw image bytes
     * @param width     target width in pixels
     * @param height    target height in pixels
     * @return resized image bytes
     */
    byte[] resize(byte[] imageData, int width, int height);

    /**
     * Create a thumbnail with the given max dimension (maintains aspect ratio).
     *
     * @param imageData    raw image bytes
     * @param maxDimension maximum width or height in pixels
     * @return thumbnail image bytes
     */
    byte[] thumbnail(byte[] imageData, int maxDimension);

    /**
     * Detect the MIME content type of the image.
     *
     * @param imageData raw image bytes
     * @return MIME type string (e.g. "image/png")
     */
    String detectContentType(byte[] imageData);
}
