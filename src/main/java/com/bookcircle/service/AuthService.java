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

    // Check if user already exists
    public boolean userExists(String email) {
        logger.debug("Checking if user exists for email: {}", email);
        return repo.findByEmail(email).isPresent();
    }

    // Save new user with encrypted password
    public boolean saveUser(Customer user) {
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            logger.warn("Registration failed: password is missing for email {}", user.getEmail());
            return false;
        }

        try {
            logger.debug("Saving new user: {}", user.getEmail());
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            repo.save(user);
            logger.info("User saved successfully: {}", user.getEmail());
            return true;
        } catch (Exception e) {
            logger.error("Failed to save user: {}", user.getEmail(), e);
            return false;
        }
    }

    // Verify user credentials and generate JWT token
    public ApiResponse verifyUser(String email, String password) {
        // Customer cus = repo.findByEmail(email).orElse(null);  old way
        logger.debug("Verifying user credentials for email: {}", email);

        Optional<Customer> optional = repo.findByEmail(email);
        if (optional.isEmpty()) {
            logger.warn("User not found during verification: {}", email);
            return new ApiResponse("fail", "User not found");
        }

        Customer customer = optional.get();

        if (passwordEncoder.matches(password, customer.getPassword())) {
            String token = JwtUtil.generateToken(email);
            logger.info("User verified successfully and token generated: {}", email);
            return new ApiResponse("success", token);
        } else {
            logger.warn("Invalid password for user: {}", email);
            return new ApiResponse("fail", "Invalid Password");
        }
    }
}