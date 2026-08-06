package com.petshop.api.platform.image;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * No-op implementation of {@link ImageService}.
 * Returns input unchanged — no actual image processing in local development.
 */
@Slf4j
@Service
public class NoOpImageService implements ImageService {

    @Override
    public byte[] resize(byte[] imageData, int width, int height) {
        log.debug("NoOp resize called: {}x{}, returning original ({} bytes)", width, height, imageData.length);
        return imageData;
    }

    @Override
    public byte[] thumbnail(byte[] imageData, int maxDimension) {
        log.debug("NoOp thumbnail called: max={}, returning original ({} bytes)", maxDimension, imageData.length);
        return imageData;
    }

    @Override
    public String detectContentType(byte[] imageData) {
        // Simple magic-byte detection for common image formats
        if (imageData.length >= 8) {
            if (imageData[0] == (byte) 0x89 && imageData[1] == (byte) 0x50) {
                return "image/png";
            }
            if (imageData[0] == (byte) 0xFF && imageData[1] == (byte) 0xD8) {
                return "image/jpeg";
            }
            if (imageData[0] == (byte) 0x47 && imageData[1] == (byte) 0x49) {
                return "image/gif";
            }
            if (imageData[0] == (byte) 0x52 && imageData[1] == (byte) 0x49
                    && imageData[2] == (byte) 0x46 && imageData[3] == (byte) 0x46) {
                return "image/webp";
            }
        }
        return "application/octet-stream";
    }
}
