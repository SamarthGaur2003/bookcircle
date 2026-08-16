package com.bookcircle.dto;

/**
 * AI moderation result for a book listing.
 */
public record ModerationResult(
    boolean isSpam,
    int confidence,
    String reason
) {}
