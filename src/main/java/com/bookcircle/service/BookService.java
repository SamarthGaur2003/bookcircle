package com.bookcircle.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.BookFilterDTO;
import com.bookcircle.dto.BookResponse;
import com.bookcircle.entity.Book;
import com.bookcircle.entity.Customer;
import com.bookcircle.repository.BookRepository;
import com.bookcircle.repository.UserRepository;

@Service
public class BookService {

    private static final Logger logger = LoggerFactory.getLogger(BookService.class);

    @Autowired
    UserRepository userRepo;

    @Autowired
    BookRepository bookRepo;

    // ========================= ADD NEW BOOK =========================
    public ApiResponse addBook(Book book, String email) {
        logger.debug("Adding new book: {} by {}", book.getTitle(), book.getAuthor());

        Customer cus = userRepo.findByEmail(email).orElse(null);

        if (cus == null) {
            logger.warn("User not found while adding book");
            return new ApiResponse("error", "User not found", null);
        }

        book.setUser(cus);
        Book saved = bookRepo.save(book);

        BookResponse response = new BookResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getAuthor(),
                saved.getDescription(),
                saved.getPrice(),
                saved.getCondition(),
                saved.getLatitude(),
                saved.getLongitude(),
                saved.getImageUrl()
        );

        return new ApiResponse("success", "Book added successfully", response);
    }

    // ========================= GET ALL BOOKS =========================
    public ApiResponse getAllBooks() {
        logger.debug("Fetching all books");

        List<BookResponse> list = bookRepo.findAll().stream()
                .map(book -> new BookResponse(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getDescription(),
                        book.getPrice(),
                        book.getCondition(),
                        book.getLatitude(),
                        book.getLongitude(),
                        book.getImageUrl()
                ))
                .toList();

        return new ApiResponse("success", "All books fetched", list);
    }

    // ========================= GET MY BOOKS =========================
    public ApiResponse getMyBooks(String email) {
        logger.debug("Fetching books for user: {}", email);
    
        Customer user = userRepo.findByEmail(email).orElse(null);
        if(user == null) {
            logger.warn("User not found while fetching books");
            return new ApiResponse("error", "User not found", null);
        }
    
        List<BookResponse> list = bookRepo.findByUser(user).stream()
            .map(book -> new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                book.getPrice(),
                book.getCondition(),
                book.getLatitude(),
                book.getLongitude(),
                book.getImageUrl()
            ))
            .toList();

        return new ApiResponse("success", "User books fetched", list);
    }

    // ========================= GET OTHER SELLERS BOOKS =========================
    public ApiResponse getOtherBooks(String email) {
        logger.debug("Fetching other seller books for user: {}", email);

        Customer user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            logger.warn("User not found while fetching books");
            return new ApiResponse("error", "User not found", null);
        }

        List<BookResponse> list = bookRepo.findByUserNot(user).stream()
                .map(book -> new BookResponse(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getDescription(),
                        book.getPrice(),
                        book.getCondition(),
                        book.getLatitude(),
                        book.getLongitude(),
                        book.getImageUrl()
                ))
                .toList();

        return new ApiResponse("success", "Books fetched", list);
    }

    // ========================= DISTANCE CALCULATION =========================
    public double calculateDistance(double lat1, double lon1,
                                    double lat2, double lon2) {

        final int R = 6371; // Earth radius in km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // ========================= NEARBY BOOKS =========================
    public ApiResponse getNearbyBooks(String email, double userLat, double userLon) {
        logger.debug("Fetching nearby books for user: {}", email);

        Customer user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            return new ApiResponse("error", "User not found", null);
        }

        List<BookResponse> list = bookRepo.findByUserNot(user).stream()
                .filter(book -> calculateDistance(
                        userLat, userLon,
                        book.getLatitude(), book.getLongitude()
                ) <= 5)
                .map(book -> new BookResponse(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getDescription(),
                        book.getPrice(),
                        book.getCondition(),
                        book.getLatitude(),
                        book.getLongitude(),
                        book.getImageUrl()
                ))
                .toList();

        return new ApiResponse("success", "Nearby books fetched", list);
    }

    // ========================= GET SINGLE BOOK =========================
    public ApiResponse getBookById(int id) {
        logger.debug("Fetching book with id: {}", id);

        Optional<Book> bookOpt = bookRepo.findById(id);

        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();

            BookResponse response = new BookResponse(
                    book.getId(),
                    book.getTitle(),
                    book.getAuthor(),
                    book.getDescription(),
                    book.getPrice(),
                    book.getCondition(),
                    book.getLatitude(),
                    book.getLongitude(),
                    book.getImageUrl()
            );

            return new ApiResponse("success", "Book fetched", response);
        }

        logger.warn("Book not found with id: {}", id);
        return new ApiResponse("error", "Book not found", null);
    }

    // ========================= UPDATE BOOK =========================
    public ApiResponse updateBook(int id, Book data) {
        logger.debug("Updating book with id: {}", id);

        Optional<Book> existingOpt = bookRepo.findById(id);

        if (existingOpt.isEmpty()) {
            logger.warn("Book not found for update with id: {}", id);
            return new ApiResponse("error", "Book not found", null);
        }

        try {
            Book existing = existingOpt.get();

            existing.setTitle(data.getTitle());
            existing.setAuthor(data.getAuthor());
            existing.setDescription(data.getDescription());
            existing.setPrice(data.getPrice());
            existing.setCondition(data.getCondition());

            bookRepo.save(existing);

            logger.info("Book updated successfully for id: {}", id);
            return new ApiResponse("success", "Book updated successfully", null);

        } catch (Exception e) {
            logger.error("Error updating book with id: {}", id, e);
            return new ApiResponse("error", e.getMessage(), null);
        }
    }

    // ========================= DELETE BOOK =========================
    public ApiResponse deleteBook(int id) {
        logger.debug("Deleting book with id: {}", id);

        try {
            if (!bookRepo.existsById(id)) {
                logger.warn("Book not found for deletion with id: {}", id);
                return new ApiResponse("error", "Book not found", null);
            }

            bookRepo.deleteById(id);

            logger.info("Book deleted successfully for id: {}", id);
            return new ApiResponse("success", "Book deleted successfully", null);

        } catch (Exception e) {
            logger.error("Error deleting book with id: {}", id, e);
            return new ApiResponse("error", "Unable to delete book: " + e.getMessage(), null);
        }
    }

    // ========================= FILTER BOOKS =========================
    public ApiResponse filterBooks(BookFilterDTO filter, int page, int size, String sortBy, String direction) {

        List<String> allowedSortFields = List.of("price", "title", "author", "id");
        if (!allowedSortFields.contains(sortBy)) {
            sortBy = "id";
        }

        if(!direction.equalsIgnoreCase("asc") && !direction.equalsIgnoreCase("desc")) {
            direction = "desc";
        }

        Sort sort = direction.equalsIgnoreCase("asc") 
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        //trimmed for better searching
        String keyword = (filter.keyword() == null || filter.keyword().trim().isEmpty()) ? null : filter.keyword().trim();

        Page<Book> bookPage = bookRepo.filterBooks(
                keyword,
                filter.minPrice(),
                filter.maxPrice(),
                filter.condition(),
                pageable
        );

        List<BookResponse> list = bookPage.getContent().stream()
                .map(book -> new BookResponse(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getDescription(),
                        book.getPrice(),
                        book.getCondition(),
                        book.getLatitude(),
                        book.getLongitude(),
                        book.getImageUrl()
                ))
                .toList();

        // Pagination metadata (important)
        return new ApiResponse(
                "success",
                "Filtered books fetched",
                Map.of(
                        "content", list,
                        "page", bookPage.getNumber(),
                        "size", bookPage.getSize(),
                        "totalPages", bookPage.getTotalPages(),
                        "totalElements", bookPage.getTotalElements(),
                        "hasNext", bookPage.hasNext(),
                        "hasPrevious", bookPage.hasPrevious()
                )
        );
    }
}