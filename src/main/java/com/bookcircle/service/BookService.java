package com.bookcircle.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookcircle.dto.BookResponse;
import com.bookcircle.entity.Book;
import com.bookcircle.repository.BookRepository;

@Service
public class BookService {

    private static final Logger logger = LoggerFactory.getLogger(BookService.class);

    @Autowired
    BookRepository repo;

    public BookResponse addBook(Book book) {
        logger.debug("Adding new book: {} by {}", book.getTitle(), book.getAuthor());
        Book saved = repo.save(book);
        return new BookResponse(saved.getId(), saved.getTitle(), saved.getAuthor(), saved.getDescription());
    }

    public List<BookResponse> getAllBooks() {
        logger.debug("Fetching all books");
        return repo.findAll().stream()
                .map(book -> new BookResponse(book.getId(), book.getTitle(), book.getAuthor(), book.getDescription()))
                .toList();
    }
}