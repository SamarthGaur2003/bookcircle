package com.bookcircle.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be 255 characters or less")
    private String title;

    @NotBlank(message = "Author is required")
    @Size(max = 255, message = "Author must be 255 characters or less")
    private String author;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must be 2000 characters or less")
    private String description;

    // Price of book
    @Positive(message = "Price must be greater than 0")
    private double price;

    // Condition (later we convert to ENUM)
    @NotBlank(message = "Condition is required")
    @Enumerated(EnumType.STRING)
    private String condition;

    public enum BookCondition {
        NEW,
        LIKE_NEW,
        VERY_GOOD,
        GOOD,
        ACCEPTABLE
    }

    // Location (temporary - later lat/long)
    // @NotBlank(message = "Location is required")
    // private String location;

    @Min(value = -90, message = "Latitude must be >= -90")
    @Max(value = 90, message = "Latitude must be <= 90")
    private double latitude;

    @Min(value = -180, message = "Longitude must be >= -180")
    @Max(value = 180, message = "Longitude must be <= 180")
    private double longitude;

    // Image URL (Cloudinary later)
    private String imageUrl;

    // Owner of book
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Customer user;
}
