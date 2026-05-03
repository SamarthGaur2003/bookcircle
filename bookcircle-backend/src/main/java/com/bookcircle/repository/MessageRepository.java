package com.bookcircle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bookcircle.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Query("""
        SELECT m FROM Message m
        WHERE m.sender.id = :userId OR m.receiver.id = :userId
        ORDER BY m.timestamp DESC
    """)
    List<Message> findAllUserMessages(int userId);
    
    @Query("""
        SELECT m FROM Message m
        WHERE (m.sender.id = :user1 AND m.receiver.id = :user2)
           OR (m.sender.id = :user2 AND m.receiver.id = :user1)
        ORDER BY m.timestamp
    """)
    List<Message> getConversation(int user1, int user2);

    @Query("""
        SELECT COUNT(m) FROM Message m
        WHERE m.receiver.id = :userId
        AND m.sender.id = :otherUserId
        AND m.isRead = false
    """)
    int countUnreadMessages(int userId, int otherUserId);
}
