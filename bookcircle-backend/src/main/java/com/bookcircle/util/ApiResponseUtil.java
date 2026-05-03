package com.bookcircle.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bookcircle.dto.ApiResponse;

public final class ApiResponseUtil {

    private ApiResponseUtil() {
    }

    public static ResponseEntity<ApiResponse> toResponseEntity(ApiResponse response) {
        return toResponseEntity(response, HttpStatus.OK);
    }

    public static ResponseEntity<ApiResponse> toResponseEntity(ApiResponse response, HttpStatus successStatus) {
        HttpStatus status = switch (response.status()) {
            case "success" -> successStatus;
            case "bad_request" -> HttpStatus.BAD_REQUEST;
            case "not_found" -> HttpStatus.NOT_FOUND;
            case "exists" -> HttpStatus.CONFLICT;
            case "invalid" -> HttpStatus.UNAUTHORIZED;
            case "forbidden" -> HttpStatus.FORBIDDEN;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        return ResponseEntity.status(status).body(response);
    }
}
