package com.bookcircle.dto;

public record BookResponse(
    int id,
    String title,
    String author,
    String description,
    double price,
    String condition,
    double latitude,
    double longitude,
    String imageUrl
) {}
