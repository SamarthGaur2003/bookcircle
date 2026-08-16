package com.bookcircle.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookcircle.dto.BookRequest;
import com.bookcircle.dto.ModerationResult;
import com.bookcircle.exception.ListingRejectedException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * AI-powered listing moderation system.
 * Analyzes book listings BEFORE saving to detect spam, scams, and low-quality
 * content.
 */
@Service
public class ListingModerationService {

    private static final Logger logger = LoggerFactory.getLogger(ListingModerationService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private AiClient aiClient;

    /**
     * Moderates a book listing. If spam is detected, throws
     * ListingRejectedException.
     * If AI fails, allows the listing (fail-open strategy).
     */
    public void moderate(BookRequest request) {
        String prompt = buildModerationPrompt(request);
        String response = aiClient.generate(prompt);

        if (response == null || response.isBlank()) {
            logger.warn("AI moderation returned empty response — allowing listing (fail-open)");
            return;
        }

        try {
            ModerationResult result = parseResult(response);

            logger.info("AI Moderation Result — isSpam: {}, confidence: {}, reason: {}",
                    result.isSpam(), result.confidence(), result.reason());

            if (result.isSpam() && result.confidence() >= 60) {
                throw new ListingRejectedException(result.reason());
            }

        } catch (ListingRejectedException e) {
            throw e; // re-throw to be caught by GlobalExceptionHandler
        } catch (Exception e) {
            logger.error("Failed to parse AI moderation response — allowing listing (fail-open)", e);
        }
    }

    private String buildModerationPrompt(BookRequest request) {
        return """
                You are a content moderation system for a book marketplace called BookCircle.

                Analyze this book listing and determine if it is spam, a scam, or low-quality.

                Listing details:
                - Title: %s
                - Author: %s
                - Description: %s
                - Location: %s
                - Price: %s
                - Condition: %s

                Detect issues such as:
                - Spam keywords, repeated words, gibberish
                - Phone numbers, WhatsApp contact requests, or external URLs
                - Obvious scams or fake/misleading descriptions
                - Excessive uppercase or promotional marketing text

                Return ONLY a valid JSON object with NO markdown formatting:
                {"isSpam":boolean,"confidence":number,"reason":"concise explanation"}
                """.formatted(
                safe(request.title()),
                safe(request.author()),
                safe(request.description()),
                safe(request.location()),
                request.price(),
                safe(request.condition()));
    }

    private ModerationResult parseResult(String response) {
        String cleaned = response.trim()
                .replaceAll("```json\\s*", "")
                .replaceAll("```\\s*", "")
                .trim();

        int start = cleaned.indexOf('{');
        int end = cleaned.lastIndexOf('}');
        if (start != -1 && end > start) {
            cleaned = cleaned.substring(start, end + 1);
        }

        try {
            JsonNode node = objectMapper.readTree(cleaned);
            boolean isSpam = node.path("isSpam").asBoolean(false);

            // Normalize confidence to 0-100 scale (whether Gemini returns 0.95 or 95)
            double confVal = node.path("confidence").asDouble(100.0);
            int confidence = confVal <= 1.0 ? (int) Math.round(confVal * 100) : (int) Math.round(confVal);

            String reason = node.path("reason").asText("Listing appears suspicious or violates content guidelines.");

            return new ModerationResult(isSpam, confidence, reason);
        } catch (Exception e) {
            logger.warn("Could not parse JSON with ObjectMapper: {}", cleaned);
            boolean isSpam = cleaned.contains("\"isSpam\":true") || cleaned.contains("\"isSpam\": true");
            return new ModerationResult(isSpam, isSpam ? 90 : 0, "Contains suspicious content");
        }
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
