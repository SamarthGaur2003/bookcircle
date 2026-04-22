package com.bookcircle.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerCustomer(@Valid @RequestBody Customer customer) {

        ApiResponse response = service.registerUser(customer);

        if ("success".equals(response.status())) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else if ("exists".equals(response.status())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest loginRequest) {

        ApiResponse response = service.verifyUser(
                loginRequest.email(),
                loginRequest.password()
        );

        switch (response.status()) {
            case "success":
                return ResponseEntity.ok(response);

            case "not_found":
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

            case "invalid":
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}