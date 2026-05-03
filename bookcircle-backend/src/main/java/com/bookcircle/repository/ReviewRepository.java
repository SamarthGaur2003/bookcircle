package com.bookcircle.repository;
import java.util.List;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bookcircle.entity.Customer;
import com.bookcircle.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findBySeller(Customer seller);
    boolean existsByReviewerAndSeller(Customer reviewer, Customer seller);
}