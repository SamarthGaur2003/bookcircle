package com.bookcircle.dto;

public record ReviewResponse(
    int id,
    int rating,
    String comment,
    String reviewerName
) {}
