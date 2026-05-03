package com.bookcircle.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Min(1)
    @Max(5)
    private int rating; // 1 to 5

    @Size(max = 500)
    private String comment;

    // reviewer (buyer)
    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private Customer reviewer;

    // seller (owner of book)
    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Customer seller;
}