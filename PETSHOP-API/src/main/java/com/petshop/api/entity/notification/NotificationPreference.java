package com.petshop.api.entity.notification;

import com.petshop.api.auth.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_preferences")
@IdClass(NotificationPreferenceId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreference {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType;

    @Column(name = "in_app_enabled", nullable = false)
    private Boolean inAppEnabled;

    @Column(name = "push_enabled", nullable = false)
    private Boolean pushEnabled;

    @Column(name = "email_enabled", nullable = false)
    private Boolean emailEnabled;
}
