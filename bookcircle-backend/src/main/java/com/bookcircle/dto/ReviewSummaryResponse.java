package com.bookcircle.dto;

import java.io.Serializable;

/**
 * AI-generated review summary for a seller.
 * Implements Serializable so Redis can store this object as a stream of bytes.
 */
public record ReviewSummaryResponse(
    double averageRating,
    int reviewCount,
    String summary
) implements Serializable {}
