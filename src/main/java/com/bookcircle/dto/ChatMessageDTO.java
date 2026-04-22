package com.bookcircle.dto;

public record ChatMessageDTO(
    int senderId,
    int receiverId,
    String content
) {}
