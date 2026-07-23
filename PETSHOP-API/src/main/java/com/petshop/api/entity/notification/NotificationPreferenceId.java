package com.petshop.api.entity.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceId implements Serializable {

    private UUID user;
    private String notificationType;
}
