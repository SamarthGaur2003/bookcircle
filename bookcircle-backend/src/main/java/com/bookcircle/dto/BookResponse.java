package com.bookcircle.dto;
import java.util.List;

public record BookResponse(
    int id,
    String title,
    String author,
    String description,
    double price,
    String condition,
    String location,
    double latitude,
    double longitude,
    List<String> imageUrls,
    int sellerId,
    String sellerName
) {}
