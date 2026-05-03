package com.bookcircle.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bookcircle.dto.ApiResponse;
import com.bookcircle.dto.BookFilterDTO;
import com.bookcircle.dto.BookRequest;
import com.bookcircle.dto.BookResponse;
import com.bookcircle.dto.GeocodingResult;
import com.bookcircle.entity.Book;
import com.bookcircle.entity.Book.BookCondition;
import com.bookcircle.entity.Customer;
import com.bookcircle.repository.BookRepository;
import com.bookcircle.repository.UserRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class BookService {

    private static final Logger logger = LoggerFactory.getLogger(BookService.class);
    private static final Set<String> ALLOWED_GOOGLE_LOCATION_TYPES = Set.of("ROOFTOP", "RANGE_INTERPOLATED");

    @Autowired
    UserRepository userRepo;

    @Autowired
    BookRepository bookRepo;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    GoogleGeocodingService googleGeocodingService;

    // ========================= ADD NEW BOOK =========================
    public ApiResponse addBook(BookRequest request, List<MultipartFile> images, String email) {
        logger.debug("Adding new book: {} by {}", request.title(), request.author());

        Customer cus = userRepo.findByEmail(email).orElse(null);

        if (cus == null) {
            logger.warn("User not found while adding book");
            return new ApiResponse("not_found", "User not found", null);
        }

        try {
            BookCondition condition = parseRequiredBookCondition(request.condition());
            GeocodingResult geocodingResult = resolveCoordinates(request);
   
            List<String> imageUrls = uploadImages(images);
            System.out.println("IMAGE URLS: " + imageUrls);

            Book book = new Book();
            applyBookData(book, request, condition, geocodingResult, null);
            
            book.setImageUrls(imageUrls);
            book.setUser(cus);

            Book saved = bookRepo.save(book);
            BookResponse response = toBookResponse(saved);

            return new ApiResponse("success", "Book added successfully", response);

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid book add request", e);
            return new ApiResponse("bad_request", e.getMessage(), null);
        } catch (IllegalStateException e) {
            logger.error("Location service failed while adding book", e);
            return new ApiResponse("error", "Unable to fetch location coordinates", null);
        }
    }

    // ========================= GET ALL BOOKS =========================
    public ApiResponse getAllBooks() {
        logger.debug("Fetching all books");

        List<BookResponse> list = bookRepo.findAll().stream()
                .map(this::toBookResponse)
                .toList();

        return new ApiResponse("success", "All books fetched", list);
    }

    // ========================= GET MY BOOKS =========================
    public ApiResponse getMyBooks(String email) {
        logger.debug("Fetching books for user: {}", email);
    
        Customer user = userRepo.findByEmail(email).orElse(null);
        if(user == null) {
            logger.warn("User not found while fetching books");
            return new ApiResponse("not_found", "User not found", null);
        }
    
        List<BookResponse> list = bookRepo.findByUser(user).stream()
            .map(this::toBookResponse)
            .toList();

        return new ApiResponse("success", "User books fetched", list);
    }

    // ========================= GET OTHER SELLERS BOOKS =========================
    public ApiResponse getOtherBooks(String email) {
        logger.debug("Fetching other seller books for user: {}", email);

        Customer user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            logger.warn("User not found while fetching books");
            return new ApiResponse("not_found", "User not found", null);
        }

        List<BookResponse> list = bookRepo.findByUserNot(user).stream()
                .map(this::toBookResponse)
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
    public ApiResponse getNearbyBooks(String email, double userLat, double userLon, double radiusKm) {
        logger.debug("Fetching nearby books for user: {}", email);

        Customer user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            return new ApiResponse("not_found", "User not found", null);
        }

        if (radiusKm <= 0) {
            return new ApiResponse("bad_request", "Radius must be greater than 0", null);
        }

        List<BookResponse> list = bookRepo.findAll().stream()
                .filter(book -> book.getUser() != null && !book.getUser().getEmail().equals(email))
                .filter(book -> calculateDistance(
                        userLat, userLon,
                        book.getLatitude(), book.getLongitude()
                ) <= radiusKm)
                .map(this::toBookResponse)
                .toList();

        return new ApiResponse("success", "Nearby books fetched", list);
    }

    // ========================= GET SINGLE BOOK =========================
    public ApiResponse getBookById(int id) {
        logger.debug("Fetching book with id: {}", id);

        Optional<Book> bookOpt = bookRepo.findById(id);

        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();

            BookResponse response = toBookResponse(book);

            return new ApiResponse("success", "Book fetched", response);
        }

        logger.warn("Book not found with id: {}", id);
        return new ApiResponse("not_found", "Book not found", null);
    }

    // ========================= UPDATE BOOK =========================
    public ApiResponse updateBook(int id, BookRequest data, List<MultipartFile> images) {
        logger.debug("Updating book with id: {}", id);

        Optional<Book> existingOpt = bookRepo.findById(id);

        if (existingOpt.isEmpty()) {
            logger.warn("Book not found for update with id: {}", id);
            return new ApiResponse("not_found", "Book not found", null);
        }

        try {
            Book existing = existingOpt.get();
            BookCondition condition = parseRequiredBookCondition(data.condition());
            GeocodingResult geocodingResult = resolveCoordinates(data);

            applyBookData(existing, data, condition, geocodingResult, existing.getLocation());

            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = uploadImages(images);
                existing.setImageUrls(imageUrls);
            }

            Book saved = bookRepo.save(existing);

            logger.info("Book updated successfully for id: {}", id);
            return new ApiResponse("success", "Book updated successfully", toBookResponse(saved));

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid book update request for id: {}", id, e);
            return new ApiResponse("bad_request", e.getMessage(), null);
        } catch (IllegalStateException e) {
            logger.error("Location service failed while updating book with id: {}", id, e);
            return new ApiResponse("error", "Unable to fetch location coordinates", null);
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
                return new ApiResponse("not_found", "Book not found", null);
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
    public ApiResponse filterBooks(BookFilterDTO filter, int page, int size, String sortBy, String direction, String email) {

        List<String> allowedSortFields = List.of("price", "title", "author", "condition", "location", "id");
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
        String location = (filter.location() == null || filter.location().trim().isEmpty()) ? null : filter.location().trim();
        BookCondition condition;

        try {
            condition = parseBookCondition(filter.condition());
        } catch (IllegalArgumentException e) {
            return new ApiResponse("bad_request", e.getMessage(), null);
        }

        Page<Book> bookPage = bookRepo.filterBooks(
                keyword,
                location,
                filter.minPrice(),
                filter.maxPrice(),
                condition,
                email,
                pageable
        );

        List<BookResponse> list = bookPage.getContent().stream()
                .map(this::toBookResponse)
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

    // ========================= SIMILAR BOOKS =========================
    public ApiResponse getSimilarBooks(int bookId) {
        Optional<Book> bookOpt = bookRepo.findById(bookId);

        if (bookOpt.isEmpty()) {
            return new ApiResponse("not_found", "Book not found", null);
        }

        Book book = bookOpt.get();
        Pageable limit = PageRequest.of(0, 4);

        List<BookResponse> similar = bookRepo
                .findSimilarBooks(bookId, book.getCondition(), book.getAuthor(), limit)
                .stream()
                .map(this::toBookResponse)
                .toList();

        return new ApiResponse("success", "Similar books fetched", similar);
    }

    private List<String> uploadImages(List<MultipartFile> files) {
        System.out.println("FILES COUNT: " + files.size());
        try {
    
            if (files == null || files.isEmpty()) {
                throw new IllegalArgumentException("At least one image is required");
            }
    
            if (files.size() > 3) {
                throw new IllegalArgumentException("Maximum 3 images allowed");
            }
    
            List<String> urls = new ArrayList<>();
    
            for (MultipartFile file : files) {
                Map uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap("folder", "bookcircle")
                );
                urls.add(uploadResult.get("secure_url").toString());
            }
    
            return urls;
    
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();   // 🔥 IMPORTANT
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    private void applyBookData(
            Book book,
            BookRequest data,
            BookCondition condition,
            GeocodingResult geocodingResult,
            String fallbackLocation) {
        book.setTitle(data.title());
        book.setAuthor(data.author());
        book.setDescription(data.description());
        book.setPrice(data.price());
        book.setCondition(condition);
        book.setLocation(resolveStoredLocation(data, geocodingResult, fallbackLocation));
        book.setLatitude(geocodingResult.latitude());
        book.setLongitude(geocodingResult.longitude());
    }

    private BookResponse toBookResponse(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                book.getPrice(),
                book.getCondition() == null ? null : book.getCondition().name(),
                book.getLocation(),
                book.getLatitude(),
                book.getLongitude(),
                book.getImageUrls(),
                book.getUser().getId(),
                book.getUser().getName()
        );
    }

    private BookCondition parseBookCondition(String condition) {
        if (condition == null || condition.isBlank()) {
            return null;
        }

        try {
            return BookCondition.valueOf(condition.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Condition must be one of: NEW, LIKE_NEW, EXCELLENT, VERY_GOOD, GOOD, ACCEPTABLE"
            );
        }
    }

    private BookCondition parseRequiredBookCondition(String condition) {
        BookCondition parsedCondition = parseBookCondition(condition);
        if (parsedCondition == null) {
            throw new IllegalArgumentException("Condition is required");
        }

        return parsedCondition;
    }

    private GeocodingResult resolveCoordinates(BookRequest request) {
        String location = normalizeText(request.location());
        boolean hasLocation = location != null;
        boolean hasLatitude = request.latitude() != null;
        boolean hasLongitude = request.longitude() != null;

        if (!hasLocation && !hasLatitude && !hasLongitude) {
            throw new IllegalArgumentException("Location or coordinates are required");
        }

        if (hasLatitude != hasLongitude) {
            throw new IllegalArgumentException("Both latitude and longitude must be provided");
        }

        if (hasLatitude) {
            return new GeocodingResult(
                    request.latitude(),
                    request.longitude(),
                    location,
                    "USER_PROVIDED"
            );
        }

        GeocodingResult result = googleGeocodingService.geocode(location)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unable to find accurate coordinates for this location. Please select a valid Google Maps location."
                ));

        if (result.locationType() == null || !ALLOWED_GOOGLE_LOCATION_TYPES.contains(result.locationType())) {
            throw new IllegalArgumentException(
                    "Please select a more accurate location from Google Maps."
            );
        }

        return result;
    }

    private String normalizeText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String resolveStoredLocation(
            BookRequest data,
            GeocodingResult geocodingResult,
            String fallbackLocation) {
        String formattedAddress = normalizeText(geocodingResult.formattedAddress());
        if (formattedAddress != null) {
            return formattedAddress;
        }

        String requestedLocation = normalizeText(data.location());
        if (requestedLocation != null) {
            return requestedLocation;
        }

        return fallbackLocation;
    }
}
