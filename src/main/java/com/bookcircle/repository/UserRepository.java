package com.bookcircle.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.bookcircle.entity.Customer;

@Repository
public interface UserRepository extends JpaRepository<Customer, Integer>{
    Optional<Customer> findByEmail(String email);
}
