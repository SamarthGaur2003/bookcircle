package com.bookcircle.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bookcircle.dto.ApiResponse;
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

    //Get Customer Data by using email
    public UserResponse getCurrentUser(String email) {
        logger.debug("Fetching user data for email: {}", email);
        Optional<Customer> customerOpt = repo.findByEmail(email);
        if (customerOpt.isPresent()) {
            Customer cus = customerOpt.get();
            return new UserResponse(cus.getId(), cus.getName(), cus.getEmail());
        } else {
            logger.warn("User not found for email: {}", email);
            throw new RuntimeException("User not found");
        }
    }

    public List<UserResponse> getAllUser() {
        logger.debug("Fetching all users");
        List<Customer> customers = repo.findAll();
        return customers.stream()
                .map(cus -> new UserResponse(cus.getId(), cus.getName(), cus.getEmail()))
                .toList();
    }

    // Update Customer Data
    public ApiResponse updateCustomer(int id, Customer data) {
        logger.debug("Updating customer with id: {}", id);
        Optional<Customer> existingOpt = repo.findById(id);
        if (existingOpt.isPresent()) {
            Customer existing = existingOpt.get();
            existing.setName(data.getName());
            existing.setEmail(data.getEmail());
            if (data.getPassword() != null && !data.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(data.getPassword()));
            } else {
                logger.debug("Password not provided for update id: {}, keeping existing password", id);
            }
            try {
                repo.save(existing);
                logger.info("Customer updated successfully for id: {}", id);
                return new ApiResponse("success", "Data Updated Successfully");
            } catch (Exception e) {
                logger.error("Error updating customer with id: {}", id, e);
                return new ApiResponse("error", e.getMessage());
            }
        }
        logger.warn("Customer not found for update with id: {}", id);
        return new ApiResponse("error", "User not found");
    }

    public ApiResponse deleteCustomer(int id) {
        logger.debug("Deleting customer with id: {}", id);
        try {
            if (repo.existsById(id)) {
                repo.deleteById(id);
                logger.info("Customer deleted successfully for id: {}", id);
                return new ApiResponse("success", "User Deleted Successfully");
            } else {
                logger.warn("Customer not found for deletion with id: {}", id);
                return new ApiResponse("error", "User not found");
            }
        } catch (Exception e) {
            logger.error("Error deleting customer with id: {}", id, e);
            return new ApiResponse("error", "Unable to delete user: " + e.getMessage());
        }
    }
}
