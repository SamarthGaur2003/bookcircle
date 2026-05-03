package com.bookcircle.dto;

public record BookFilterDTO(
        String keyword,
        String location,
        Double minPrice,
        Double maxPrice,
        String condition
) {}
