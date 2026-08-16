package com.bookcircle.exception;

import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.bookcircle.dto.ApiResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ================= VALIDATION ERROR =================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException ex) {

        String errorMsg = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse("error", errorMsg, null));
    }

    // ================= LISTING REJECTED (AI Moderation) =================
    @ExceptionHandler(ListingRejectedException.class)
    public ResponseEntity<ApiResponse> handleListingRejected(ListingRejectedException ex) {

        logger.warn("Listing rejected by AI moderation: {}", ex.getReason());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse("error", "Listing rejected: " + ex.getReason(), null));
    }

    // ================= RUNTIME EXCEPTION =================
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> handleRuntime(RuntimeException ex) {

        logger.error("Runtime exception", ex);

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse("error", ex.getMessage(), null));
    }

    // ================= GENERIC EXCEPTION =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneric(Exception ex) {

        logger.error("Unhandled exception", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("error", "Internal server error", null));
    }
}