package com.bookcircle.entity;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotNull(message = "Condition is required")
    @Enumerated(EnumType.STRING)
    private BookCondition condition;

    public enum BookCondition {
        NEW,
        LIKE_NEW,
        EXCELLENT,
        VERY_GOOD,
        GOOD,
        ACCEPTABLE
    }

    @Size(min = 2, max = 255, message = "Location must be between 2 and 255 characters")
    @Column(length = 255)
    private String location;

    @Min(value = -90, message = "Latitude must be >= -90")
    @Max(value = 90, message = "Latitude must be <= 90")
    private double latitude;

    @Min(value = -180, message = "Longitude must be >= -180")
    @Max(value = 180, message = "Longitude must be <= 180")
    private double longitude;

    // Image URL (Cloudinary later)
    @ElementCollection
    @CollectionTable(name = "book_image_urls", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    // Owner of book
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Customer user;
}
