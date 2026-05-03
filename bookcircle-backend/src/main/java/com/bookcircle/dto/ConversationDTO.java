package com.bookcircle.dto;

import java.time.LocalDateTime;

public record ConversationDTO(
        int userId,
        String userName,
        String lastMessage,
        LocalDateTime timestamp,
        int unreadCount 
) {}