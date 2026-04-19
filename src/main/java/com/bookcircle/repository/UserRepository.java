package com.bookcircle.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.bookcircle.entity.Customer;

public interface UserRepository extends JpaRepository<Customer, Integer>{
    Optional<Customer> findByEmail(String email);
}
