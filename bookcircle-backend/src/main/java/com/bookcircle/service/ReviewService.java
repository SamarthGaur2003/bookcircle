package com.bookcircle.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.ReviewResponse;
import com.bookcircle.entity.Customer;
import com.bookcircle.entity.Review;
import com.bookcircle.repository.UserRepository;
import com.bookcircle.repository.ReviewRepository;

@Service
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    UserRepository userRepo;

    @Autowired
    ReviewRepository reviewRepo;

    // ================= ADD REVIEW =================
    public ApiResponse addReview(int sellerId, int rating, String comment, String reviewerEmail) {

        Customer reviewer = userRepo.findByEmail(reviewerEmail).orElse(null);
        Customer seller = userRepo.findById(sellerId).orElse(null);

        if (reviewer == null || seller == null) {
            return new ApiResponse("error", "User not found", null);
        }

        // ✅ Prevent self-review
        if (reviewer.getId() == seller.getId()) {
            return new ApiResponse("error", "You cannot review yourself", null);
        }

        // ✅ Validate rating
        if (rating < 1 || rating > 5) {
            return new ApiResponse("error", "Rating must be between 1 and 5", null);
        }

        // ✅ Prevent duplicate reviews
        if (reviewRepo.existsByReviewerAndSeller(reviewer, seller)) {
            return new ApiResponse("error", "You have already reviewed this seller", null);
        }

        try {
            Review review = new Review();
            review.setRating(rating);
            review.setComment(comment);
            review.setReviewer(reviewer);
            review.setSeller(seller);

            reviewRepo.save(review);

            return new ApiResponse("success", "Review added successfully", null);

        } catch (Exception e) {
            logger.error("Error adding review", e);
            return new ApiResponse("error", "Failed to add review", null);
        }
    }

    // ================= GET SELLER REVIEWS =================
    public ApiResponse getSellerReviews(int sellerId) {

        logger.debug("Fetching reviews for seller: {}", sellerId);

        Customer seller = userRepo.findById(sellerId).orElse(null);

        if (seller == null) {
            return new ApiResponse("error", "Seller not found", null);
        }

        List<Review> reviews = reviewRepo.findBySeller(seller);

        // ✅ FIX: empty = success, not error
        if (reviews.isEmpty()) {
            return new ApiResponse("success", "No reviews found", List.of());
        }

        List<ReviewResponse> list = reviews.stream()
                .map(r -> new ReviewResponse(
                        r.getId(),
                        r.getRating(),
                        r.getComment(),
                        r.getReviewer().getName()
                ))
                .toList();

        return new ApiResponse("success", "Reviews fetched", list);
    }

    // ================= GET AVERAGE RATING =================
    public ApiResponse getAverageRating(int sellerId) {

        logger.debug("Calculating average rating for seller: {}", sellerId);

        Customer seller = userRepo.findById(sellerId).orElse(null);

        if (seller == null) {
            return new ApiResponse("error", "Seller not found", null);
        }

        List<Review> reviews = reviewRepo.findBySeller(seller);

        // ✅ FIX: empty = 0 instead of error
        if (reviews.isEmpty()) {
            return new ApiResponse("success", "No ratings available", 0.0);
        }

        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);

        return new ApiResponse("success", "Average rating calculated", avg);
    }
}