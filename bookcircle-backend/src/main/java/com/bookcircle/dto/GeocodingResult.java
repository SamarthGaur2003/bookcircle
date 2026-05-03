package com.bookcircle.dto;

public record GeocodingResult(
        double latitude,
        double longitude,
        String formattedAddress,
        String locationType
) {}
