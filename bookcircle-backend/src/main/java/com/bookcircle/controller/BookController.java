package com.bookcircle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.BookFilterDTO;
import com.bookcircle.dto.BookRequest;
import com.bookcircle.service.BookService;
import com.bookcircle.util.ApiResponseUtil;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/book")
@Validated
public class BookController {

    @Autowired
    BookService bookService;

    // Add new book listing (multipart form data with images)
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addBook(
            @Valid @ModelAttribute BookRequest book,
            @RequestParam("images") List<MultipartFile> images,
            Authentication auth) {

        return ApiResponseUtil.toResponseEntity(
                bookService.addBook(book, images, auth.getName()),
                HttpStatus.CREATED
        );
    }

    // Update existing book listing (multipart form data with optional images)
    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateBook(
            @RequestParam int id,
            @Valid @ModelAttribute BookRequest book,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        return ApiResponseUtil.toResponseEntity(
                bookService.updateBook(id, book, images)
        );
    }


    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getBooks() {
        return ApiResponseUtil.toResponseEntity(bookService.getAllBooks());
    }

    @GetMapping("/mybooks")
    public ResponseEntity<ApiResponse> getMyBooks(Authentication auth) {
        return ApiResponseUtil.toResponseEntity(bookService.getMyBooks(auth.getName()));
    }

    @GetMapping("/explore")
    public ResponseEntity<ApiResponse> exploreBooks(Authentication auth) {
        return ApiResponseUtil.toResponseEntity(bookService.getOtherBooks(auth.getName()));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse> getNearbyBooks(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5") double radius,
            Authentication auth) {

        return ApiResponseUtil.toResponseEntity(
                bookService.getNearbyBooks(auth.getName(), lat, lon, radius)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getBook(@PathVariable int id) {
        return ApiResponseUtil.toResponseEntity(bookService.getBookById(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteBook(@PathVariable int id) {
        return ApiResponseUtil.toResponseEntity(bookService.deleteBook(id));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse> filterBooks(
            BookFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy, //for latest books to be showen first
            @RequestParam(defaultValue = "desc") String direction,
            Authentication auth
    ) {
        String email = auth != null ? auth.getName() : null;
        return ApiResponseUtil.toResponseEntity(
                bookService.filterBooks(filter, page, size, sortBy, direction, email)
        );
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<ApiResponse> getSimilarBooks(@PathVariable int id) {
        return ApiResponseUtil.toResponseEntity(bookService.getSimilarBooks(id));
    }
}