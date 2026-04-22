package com.bookcircle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.BookFilterDTO;
import com.bookcircle.entity.Book;
import com.bookcircle.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/book")
@Validated
public class BookController {

    @Autowired
    BookService bookService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addBook(@Valid @RequestBody Book book, Authentication auth) {
        return ResponseEntity.ok(bookService.addBook(book, auth.getName()));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/mybooks")
    public ResponseEntity<ApiResponse> getMyBooks(Authentication auth) {
        return ResponseEntity.ok(bookService.getMyBooks(auth.getName()));
    }

    // Explore all books (other sellers)
    @GetMapping("/explore")
    public ResponseEntity<ApiResponse> exploreBooks(Authentication auth) {
        return ResponseEntity.ok(bookService.getOtherBooks(auth.getName()));
    }

    // Nearby books within 5km
    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse> getNearbyBooks(
            @RequestParam double lat,
            @RequestParam double lon,
            Authentication auth) {

        return ResponseEntity.ok(
                bookService.getNearbyBooks(auth.getName(), lat, lon));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getBook(@PathVariable int id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateBook(
            @RequestParam int id,
            @Valid @RequestBody Book book) {

        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteBook(@PathVariable int id) {
        return ResponseEntity.ok(bookService.deleteBook(id));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse> filterBooks(
            BookFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy, //for latest books shown first
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return ResponseEntity.ok(
                bookService.filterBooks(filter, page, size, sortBy, direction)
        );
    }
}