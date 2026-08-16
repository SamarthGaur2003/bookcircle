package com.bookcircle.exception;

/**
 * Thrown when AI moderation flags a book listing as spam or low quality.
 * Handled by GlobalExceptionHandler to return a 400 response.
 */
public class ListingRejectedException extends RuntimeException {

    private final String reason;

    public ListingRejectedException(String reason) {
        super("Listing rejected: " + reason);
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }
}
