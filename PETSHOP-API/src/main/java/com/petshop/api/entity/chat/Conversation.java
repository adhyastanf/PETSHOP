package com.petshop.api.entity.chat;

import com.petshop.api.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation extends BaseEntity {

    @Column(name = "merchant_id")
    private UUID merchantId;

    @Column(name = "conversation_type", nullable = false, length = 20)
    private String conversationType;

    @Column(name = "order_id")
    private UUID orderId;

    @Column(name = "booking_id")
    private UUID bookingId;

    @Column(name = "last_message_at")
    private Instant lastMessageAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
