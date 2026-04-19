package com.bookcircle.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.UserResponse;
import com.bookcircle.entity.Customer;
import com.bookcircle.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserService service;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        logger.debug("Getting current user for: {}", authentication.getName());
        UserResponse user = service.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        logger.debug("Getting all users");
        List<UserResponse> users = service.getAllUser();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateUser(@RequestParam int id, @RequestBody Customer data) {
        logger.debug("Updating user with id: {}", id);
        ApiResponse response = service.updateCustomer(id, data);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable int id) {
        logger.debug("Deleting user with id: {}", id);
        ApiResponse response = service.deleteCustomer(id);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException e) {
        logger.error("Runtime exception occurred", e);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse("error", e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleException(Exception e) {
        logger.error("Unexpected exception occurred", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("error", "Internal server error"));
    }
}
