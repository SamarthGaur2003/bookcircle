package com.bookcircle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.entity.Review;
import com.bookcircle.service.ReviewService;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService service;

    // ================= ADD REVIEW =================
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addReview(
            @RequestParam int sellerId,
            @RequestBody Review review,
            Authentication auth) {

        return ResponseEntity.ok(
                service.addReview(
                        sellerId,
                        review.getRating(),
                        review.getComment(),
                        auth.getName()
                )
        );
    }

    // ================= GET SELLER REVIEWS =================
    @GetMapping("/seller/{id}")
    public ResponseEntity<ApiResponse> getReviews(@PathVariable int id) {
        return ResponseEntity.ok(service.getSellerReviews(id));
    }

    // ================= GET AVERAGE RATING =================
    @GetMapping("/seller/{id}/average")
    public ResponseEntity<ApiResponse> getAvg(@PathVariable int id) {
        return ResponseEntity.ok(service.getAverageRating(id));
    }
}