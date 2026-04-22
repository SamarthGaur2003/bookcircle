package com.bookcircle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookcircle.dto.ConversationDTO;
import com.bookcircle.entity.Message;
import com.bookcircle.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    // Get conversation (chat List like whatsapp homescreen)
    @GetMapping("/conversations")
    public List<ConversationDTO> getConversations(Authentication auth) {

        String email = auth.getName(); // from JWT

        return chatService.getConversationsByEmail(email);
    }

    // Get conversation (chat history)
    @GetMapping("/conversation")
    public List<Message> getConversation(
            @RequestParam int user1,
            @RequestParam int user2) {

        return chatService.getConversation(user1, user2);
    }

    @PutMapping("/read")
    public String markAsRead(@RequestParam int senderId,
                            Authentication auth) {

        String email = auth.getName();
        chatService.markMessagesAsRead(email, senderId);

        return "Marked as read";
    }
}