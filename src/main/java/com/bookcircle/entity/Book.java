package com.bookcircle.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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

    // later we will link with user
}
