package com.bookcircle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.bookcircle.dto.BookResponse;
import com.bookcircle.entity.Book;
import com.bookcircle.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/book")
@Validated
public class BookController {

    @Autowired
    BookService service;

    @PostMapping("/add")
    public ResponseEntity<BookResponse> addBook(@Valid @RequestBody Book book) {
        BookResponse response = service.addBook(book);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookResponse>> getBooks() {
        return ResponseEntity.ok(service.getAllBooks());
    }
}