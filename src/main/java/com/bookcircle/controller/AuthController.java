package com.bookcircle.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.LoginRequest;
import com.bookcircle.entity.Customer;
import com.bookcircle.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthService service;

    // REGISTER REQUEST HANDLING
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerCustomer(@Valid @RequestBody Customer customer) {
        logger.debug("Register request received for email: {}", customer.getEmail());
        
        // User already exists?
        if (service.userExists(customer.getEmail())) {
            logger.warn("User already exists: {}", customer.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse("error", "User already registered"));
        }

        // Register user
        if (service.saveUser(customer)) {
            logger.info("User registered successfully: {}", customer.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("success", "User registered successfully"));
        } else {
            logger.error("Registration failed for: {}", customer.getEmail());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Registration failed"));
        }
    }

    // LOGIN REQUEST HANDLING
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.debug("Login request received for email: {}", loginRequest.email());
        
        ApiResponse response = service.verifyUser(loginRequest.email(), loginRequest.password());

        if ("success".equals(response.status())) {
            logger.info("User logged in successfully: {}", loginRequest.email());
            return ResponseEntity.ok(response);
        } else if ("User not found".equals(response.message())) {
            logger.warn("Login failed - user not found: {}", loginRequest.email());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            logger.warn("Login failed - invalid credentials for: {}", loginRequest.email());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleException(Exception e) {
        logger.error("Unexpected exception in AuthController", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("error", "Internal server error"));
    }
}