package com.bookcircle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.ReviewRequest;
import com.bookcircle.dto.ReviewSummaryResponse;
import com.bookcircle.service.AiReviewSummaryService;
import com.bookcircle.service.ReviewService;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService service;

    @Autowired
    private AiReviewSummaryService aiReviewSummaryService;

    // ================= ADD REVIEW =================
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addReview(
            @RequestParam int sellerId,
            @RequestBody ReviewRequest review,
            Authentication auth) {

        return ResponseEntity.ok(
                service.addReview(
                        sellerId,
                        review.rating(),
                        review.comment(),
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

    // ================= GET AI REVIEW SUMMARY =================
    @GetMapping("/seller/{id}/summary")
    public ResponseEntity<ApiResponse> getReviewSummary(@PathVariable int id) {
        ReviewSummaryResponse summary = aiReviewSummaryService.getSellerSummary(id);
        return ResponseEntity.ok(new ApiResponse("success", "Review summary fetched", summary));
    }
}