package com.bookcircle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.ConversationDTO;
import com.bookcircle.entity.Message;
import com.bookcircle.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    // Get conversation list (like WhatsApp home screen)
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse> getConversations(Authentication auth) {
        String email = auth.getName();
        List<ConversationDTO> conversations = chatService.getConversationsByEmail(email);
        return ResponseEntity.ok(new ApiResponse("success", "Conversations fetched", conversations));
    }

    // Get chat history between two users
    @GetMapping("/conversation")
    public ResponseEntity<ApiResponse> getConversation(
            @RequestParam int user1,
            @RequestParam int user2) {
        List<Message> messages = chatService.getConversation(user1, user2);
        return ResponseEntity.ok(new ApiResponse("success", "Conversation fetched", messages));
    }

    // Mark messages as read
    @PutMapping("/read")
    public ResponseEntity<ApiResponse> markAsRead(
            @RequestParam int senderId,
            Authentication auth) {
        String email = auth.getName();
        chatService.markMessagesAsRead(email, senderId);
        return ResponseEntity.ok(new ApiResponse("success", "Marked as read", null));
    }
}