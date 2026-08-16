package com.bookcircle.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Google Gemini AI client implementation.
 * Uses Gemini REST API (gemini-2.0-flash model).
 */
@Service
public class GeminiAiClient implements AiClient {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAiClient.class);

    private final RestClient restClient = RestClient.create();

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent}")
    private String apiUrl;

    @Override
    public String generate(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("Gemini API key is not configured. Skipping AI generation.");
            return null;
        }

        try {
            // Build request body
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            String url = apiUrl + "?key=" + apiKey;

            GeminiResponse response = restClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response == null || response.candidates == null || response.candidates.isEmpty()) {
                logger.warn("Gemini returned empty response");
                return null;
            }

            GeminiCandidate candidate = response.candidates.get(0);
            if (candidate.content == null || candidate.content.parts == null || candidate.content.parts.isEmpty()) {
                logger.warn("Gemini returned empty content");
                return null;
            }

            return candidate.content.parts.get(0).text;

        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            logger.error("Gemini AI API error {}: {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return null;
        } catch (Exception e) {
            logger.error("Gemini AI generation failed: {}", e.getMessage(), e);
            return null;
        }
    }

    // ================= Response DTOs =================

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class GeminiResponse {
        @JsonProperty("candidates")
        public List<GeminiCandidate> candidates;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class GeminiCandidate {
        @JsonProperty("content")
        public GeminiContent content;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class GeminiContent {
        @JsonProperty("parts")
        public List<GeminiPart> parts;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class GeminiPart {
        @JsonProperty("text")
        public String text;
    }
}
