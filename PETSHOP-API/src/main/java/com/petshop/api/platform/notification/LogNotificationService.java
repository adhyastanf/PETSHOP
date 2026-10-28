package com.petshop.api.platform.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Logging implementation of {@link NotificationService}.
 * Logs notifications to the console instead of delivering them.
 * Suitable for local development and testing.
 */
@Slf4j
@Service
public class LogNotificationService implements NotificationService {

    @Override
    public void notifyUser(UUID userId, String type, String title, String message) {
        log.info("=== NOTIFICATION ===");
        log.info("User: {}", userId);
        log.info("Type: {}", type);
        log.info("Title: {}", title);
        log.info("Message: {}", message);
        log.info("=== END NOTIFICATION ===");
    }

    @Override
    public void notifyUsers(List<UUID> userIds, String type, String title, String message) {
        log.info("=== BULK NOTIFICATION ===");
        log.info("Users: {} (count: {})", userIds, userIds.size());
        log.info("Type: {}", type);
        log.info("Title: {}", title);
        log.info("Message: {}", message);
        log.info("=== END BULK NOTIFICATION ===");
    }
}
