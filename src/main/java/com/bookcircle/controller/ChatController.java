package com.bookcircle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.bookcircle.dto.ChatMessageDTO;
import com.bookcircle.entity.Message;
import com.bookcircle.service.ChatService;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Real-time send message
    @MessageMapping("/send")
    public void sendMessage(@Payload ChatMessageDTO dto) {

        // Save message to DB
        Message savedMessage = chatService.saveMessage(dto);

        // IMPORTANT: use username (email), NOT ID
        String receiverUsername = chatService.getReceiverUsername(dto.receiverId());
        String senderUsername = chatService.getSenderUsername(dto.senderId());

        // 🔐 Send ONLY to receiver
        messagingTemplate.convertAndSendToUser(
                receiverUsername,  // user identifier which is Email
                "/queue/messages",
                savedMessage
        );

        // 🔁 Send back to sender (sync UI)
        messagingTemplate.convertAndSendToUser(
                senderUsername,
                "/queue/messages",
                savedMessage
        );
    }
}