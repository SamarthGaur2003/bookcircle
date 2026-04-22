package com.bookcircle.dto;

public record BookFilterDTO(
        String keyword,
        Double minPrice,
        Double maxPrice,
        String condition
) {}