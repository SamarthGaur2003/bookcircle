package com.bookcircle.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.ContactDTO;
import com.bookcircle.dto.UserResponse;
import com.bookcircle.entity.Customer;
import com.bookcircle.repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================= CURRENT USER =================
    public ApiResponse getCurrentUser(String email) {

        Optional<Customer> customerOpt = repo.findByEmail(email);

        if (customerOpt.isEmpty()) {
            return new ApiResponse("error", "User not found", null);
        }

        Customer cus = customerOpt.get();

        UserResponse response = new UserResponse(
                cus.getId(),
                cus.getName(),
                cus.getEmail()
        );

        return new ApiResponse("success", "User fetched", response);
    }

    // ================= CONTACT =================
    public ApiResponse getContact(int userId) {

        Optional<Customer> userOpt = repo.findById(userId);

        if (userOpt.isEmpty()) {
            return new ApiResponse("error", "User not found", null);
        }

        Customer user = userOpt.get();

        ContactDTO contact = new ContactDTO(
                user.getName(),
                user.getEmail(),
                user.getPhone()
        );

        return new ApiResponse("success", "Contact fetched", contact);
    }

    // ================= GET ALL USERS =================
    public ApiResponse getAllUser() {

        List<UserResponse> list = repo.findAll().stream()
                .map(cus -> new UserResponse(
                        cus.getId(),
                        cus.getName(),
                        cus.getEmail()
                ))
                .toList();

        return new ApiResponse("success", "Users fetched", list);
    }

    // ================= UPDATE =================
    public ApiResponse updateCustomer(int id, Customer data) {

        Optional<Customer> existingOpt = repo.findById(id);

        if (existingOpt.isEmpty()) {
            return new ApiResponse("error", "User not found", null);
        }

        try {
            Customer existing = existingOpt.get();

            existing.setName(data.getName());
            existing.setEmail(data.getEmail());
            existing.setPhone(data.getPhone());

            if (data.getPassword() != null && !data.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(data.getPassword()));
            }

            repo.save(existing);

            return new ApiResponse("success", "User updated successfully", null);

        } catch (Exception e) {
            logger.error("Error updating user", e);
            return new ApiResponse("error", e.getMessage(), null);
        }
    }

    // ================= DELETE =================
    public ApiResponse deleteCustomer(int id) {

        try {
            if (!repo.existsById(id)) {
                return new ApiResponse("error", "User not found", null);
            }

            repo.deleteById(id);

            return new ApiResponse("success", "User deleted successfully", null);

        } catch (Exception e) {
            logger.error("Error deleting user", e);
            return new ApiResponse("error", e.getMessage(), null);
        }
    }
}