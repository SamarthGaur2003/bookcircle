package com.bookcircle.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookcircle.dto.ChatMessageDTO;
import com.bookcircle.dto.ConversationDTO;
import com.bookcircle.entity.Customer;
import com.bookcircle.entity.Message;
import com.bookcircle.repository.MessageRepository;
import com.bookcircle.repository.UserRepository;


@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private UserRepository userRepo;

    // Save message (used by WebSocket)
    public Message saveMessage(ChatMessageDTO dto) {

        Customer sender = userRepo.findById(dto.senderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Customer receiver = userRepo.findById(dto.receiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // prevent self messaging
        if (sender.getId() == receiver.getId()) {
            throw new RuntimeException("Cannot send message to yourself");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(dto.content());

        return messageRepo.save(message);
    }

    // GET RECEIVER NAME (EMAIL)
    public String getReceiverUsername(int receiverId) {
        return userRepo.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"))
                .getEmail(); // username used in JWT
    }

    // GET SENDER NAME (EMAIL)
    public String getSenderUsername(int senderId) {
        return userRepo.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"))
                .getEmail();
    }

    // Get conversation list of current user with all users he/she messaged last message shown only
    public List<ConversationDTO> getConversationsByEmail(String email) {

        Customer user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        
        int userId = user.getId();
        List<Message> messages = messageRepo.findAllUserMessages(userId);

        Map<Integer, ConversationDTO> map = new LinkedHashMap<>();

        for (Message m : messages) {

            int otherUserId;
            String otherUserName;

            if (m.getSender().getId() == userId) {
                otherUserId = m.getReceiver().getId();
                otherUserName = m.getReceiver().getName();
            } else {
                otherUserId = m.getSender().getId();
                otherUserName = m.getSender().getName();
            }
            // only first message (latest)
            if (!map.containsKey(otherUserId)) {
                map.put(otherUserId, new ConversationDTO(
                        otherUserId,
                        otherUserName,
                        m.getContent(),
                        m.getTimestamp(),
                        0 //temporary
                ));
            }
        }

        // update unread count
        List<ConversationDTO> result = new ArrayList<>();

        for (ConversationDTO dto : map.values()) {

            int unread = messageRepo.countUnreadMessages(userId, dto.userId());

            result.add(new ConversationDTO(
                    dto.userId(),
                    dto.userName(),
                    dto.lastMessage(),
                    dto.timestamp(),
                    unread
            ));
        }

        return result;
    }

    // Get full conversation between two users
    public List<Message> getConversation(int user1Id, int user2Id) {

        // optional validation
        if (!userRepo.existsById(user1Id) || !userRepo.existsById(user2Id)) {
            throw new RuntimeException("User not found");
        }
        return messageRepo.getConversation(user1Id, user2Id);
    }

    // MARK MESSAGE AS READ
    public void markMessagesAsRead(String email, int senderId) {

        Customer user = userRepo.findByEmail(email).orElseThrow();
        List<Message> messages = messageRepo.getConversation(user.getId(), senderId);
    
        for (Message m : messages) {
            if (m.getReceiver().getId() == user.getId()) {
                m.setRead(true); 
            }
        }
        messageRepo.saveAll(messages);
    }
}