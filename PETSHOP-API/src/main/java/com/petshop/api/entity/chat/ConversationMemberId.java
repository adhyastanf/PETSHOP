package com.petshop.api.entity.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationMemberId implements Serializable {

    private UUID conversation;
    private UUID user;
}
