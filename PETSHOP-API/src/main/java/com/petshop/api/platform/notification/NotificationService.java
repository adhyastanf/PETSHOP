package com.petshop.api.platform.notification;

import java.util.List;
import java.util.UUID;

/**
 * Platform abstraction for user notifications (push, in-app, etc.).
 * Business modules depend on this interface, never on vendor SDKs.
 */
public interface NotificationService {

    /**
     * Send a notification to a single user.
     *
     * @param userId  target user identifier
     * @param type    notification type/category (e.g. "ORDER_UPDATE", "PROMO")
     * @param title   short notification title
     * @param message notification body message
     */
    void notifyUser(UUID userId, String type, String title, String message);

    /**
     * Send a notification to multiple users.
     *
     * @param userIds target user identifiers
     * @param type    notification type/category
     * @param title   short notification title
     * @param message notification body message
     */
    void notifyUsers(List<UUID> userIds, String type, String title, String message);
}
