package com.bookcircle.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bookcircle.config.JwtUtil;
import com.bookcircle.dto.ApiResponse;
import com.bookcircle.entity.Customer;
import com.bookcircle.repository.UserRepository;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================= REGISTER USER =================
    public ApiResponse registerUser(Customer user) {

        logger.debug("Register request for email: {}", user.getEmail());

        if (repo.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("User already exists: {}", user.getEmail());
            return new ApiResponse("exists", "User already registered", null);
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            logger.warn("Password missing for email: {}", user.getEmail());
            return new ApiResponse("error", "Password cannot be empty", null);
        }

        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            repo.save(user);

            logger.info("User registered successfully: {}", user.getEmail());
            return new ApiResponse("success", "User registered successfully", null);

        } catch (Exception e) {
            logger.error("Error while saving user: {}", user.getEmail(), e);
            return new ApiResponse("error", "Registration failed", null);
        }
    }

    // ================= VERIFY USER =================
    public ApiResponse verifyUser(String email, String password) {

        logger.debug("Login attempt for email: {}", email);

        Optional<Customer> optional = repo.findByEmail(email);

        if (optional.isEmpty()) {
            logger.warn("User not found: {}", email);
            return new ApiResponse("not_found", "User not found", null);
        }

        Customer customer = optional.get();

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            logger.warn("Invalid password for: {}", email);
            return new ApiResponse("invalid", "Invalid password", null);
        }

        try {
            String token = JwtUtil.generateToken(email);

            logger.info("Login successful for: {}", email);

            // TOKEN goes inside data
            return new ApiResponse("success", "Login successful", token);

        } catch (Exception e) {
            logger.error("Token generation failed for: {}", email, e);
            return new ApiResponse("error", "Login failed", null);
        }
    }

    // ================= CHECK USER EXISTS =================
    // (kept for future use if needed)
    public boolean userExists(String email) {
        return repo.findByEmail(email).isPresent();
    }
}