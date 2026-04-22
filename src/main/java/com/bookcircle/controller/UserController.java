package com.bookcircle.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.entity.Customer;
import com.bookcircle.service.UserService;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserService userService;

    // ================= CURRENT USER =================
    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(
                userService.getCurrentUser(authentication.getName())
        );
    }

    // ================= CONTACT =================
    @GetMapping("/contact")
    public ResponseEntity<ApiResponse> getContact(@RequestParam int userId) {
        return ResponseEntity.ok(userService.getContact(userId));
    }

    // ================= GET ALL USERS =================
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUser());
    }

    // ================= UPDATE =================
    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateUser(
            @RequestParam int id,
            @RequestBody Customer data) {

        return ResponseEntity.ok(userService.updateCustomer(id, data));
    }

    // ================= DELETE =================
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable int id) {
        return ResponseEntity.ok(userService.deleteCustomer(id));
    }
}