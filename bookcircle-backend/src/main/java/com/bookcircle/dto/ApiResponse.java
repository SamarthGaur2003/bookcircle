package com.bookcircle.dto;

public record ApiResponse(String status, String message, Object data) {
}
