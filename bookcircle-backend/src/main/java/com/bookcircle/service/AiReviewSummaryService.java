package com.bookcircle.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.bookcircle.dto.ReviewSummaryResponse;
import com.bookcircle.entity.Customer;
import com.bookcircle.entity.Review;
import com.bookcircle.repository.ReviewRepository;
import com.bookcircle.repository.UserRepository;

/**
 * AI-powered review summarization service with Redis caching.
 *
 * Caching flow:
 * 1. First request  → fetches reviews from DB → calls Gemini AI → stores in Redis
 * 2. Cached request → Redis serves instantly (no DB hit, no AI call)
 * 3. New review     → @CacheEvict removes key → next request regenerates
 * 4. Auto-expiry    → 12 hours TTL (configured in application.properties)
 */
@Service
public class AiReviewSummaryService {

    private static final Logger logger = LoggerFactory.getLogger(AiReviewSummaryService.class);

    @Autowired
    private ReviewRepository reviewRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AiClient aiClient;

    // ================= GET SELLER SUMMARY (Cached in Redis) =================
    @Cacheable(value = "reviewSummary", key = "#sellerId", unless = "#result == null || #result.summary() == null")
    public ReviewSummaryResponse getSellerSummary(int sellerId) {

        logger.info("Cache MISS — generating AI summary for seller: {}", sellerId);

        Customer seller = userRepo.findById(sellerId).orElse(null);

        if (seller == null) {
            return new ReviewSummaryResponse(0, 0, null);
        }

        // Fetch latest 100 reviews (or all if < 100)
        List<Review> reviews = reviewRepo.findTop100BySellerOrderByIdDesc(seller);

        if (reviews.isEmpty()) {
            return new ReviewSummaryResponse(0, 0, null);
        }

        // Calculate average rating
        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);

        // Build prompt with review data
        String prompt = buildSummaryPrompt(reviews);

        // Call AI
        String summary = aiClient.generate(prompt);

        if (summary == null || summary.isBlank()) {
            logger.warn("AI returned empty summary for seller: {}", sellerId);
            return new ReviewSummaryResponse(
                    Math.round(avgRating * 10.0) / 10.0,
                    reviews.size(),
                    null
            );
        }

        // Clean up summary (remove markdown formatting if any)
        summary = summary.trim()
                .replaceAll("^[\"']+|[\"']+$", "")
                .replaceAll("\\*\\*", "");

        logger.info("AI summary generated successfully for seller: {}", sellerId);

        return new ReviewSummaryResponse(
                Math.round(avgRating * 10.0) / 10.0,
                reviews.size(),
                summary
        );
    }

    // ================= INVALIDATE CACHE (Called when new review is added) =================
    @CacheEvict(value = "reviewSummary", key = "#sellerId")
    public void invalidateCache(int sellerId) {
        logger.info("Cache EVICTED — review summary cleared for seller: {}", sellerId);
    }

    // ================= BUILD AI PROMPT =================
    private String buildSummaryPrompt(List<Review> reviews) {
        String reviewText = reviews.stream()
                .map(r -> "Rating: " + r.getRating() + "/5 — \"" + (r.getComment() != null ? r.getComment() : "No comment") + "\"")
                .collect(Collectors.joining("\n"));

        return """
                You are an AI assistant analyzing feedback for a book seller on the BookCircle platform.
                
                Write a short, clear 1-2 sentence summary (maximum 35 words) evaluating the SELLER'S overall reliability, accuracy in describing book conditions, and service.
                
                Guidelines:
                - Focus on the seller's overall trustworthiness and track record as a seller, not on any single book.
                - Mention what buyers appreciate and any complaints about their service, communication, or condition accuracy.
                - Keep language simple, natural, and helpful for future buyers.
                - Return ONLY the short summary text with no quotes, bullet points, or markdown.
                
                Reviews about this seller:
                """ + reviewText;
    }
}
