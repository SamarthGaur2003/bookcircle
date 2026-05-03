package com.bookcircle.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bookcircle.entity.Book;
import com.bookcircle.entity.Book.BookCondition;
import com.bookcircle.entity.Customer;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByUser(Customer user);
    List<Book> findByUserNot(Customer user);
    
    // Custom filter with pagination
    @Query("""
        SELECT b FROM Book b
        WHERE (:keyword IS NULL OR :keyword = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(b.location) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:location IS NULL OR :location = '' OR LOWER(b.location) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:minPrice IS NULL OR b.price >= :minPrice)
        AND (:maxPrice IS NULL OR b.price <= :maxPrice)
        AND (:condition IS NULL OR b.condition = :condition)
        AND (:email IS NULL OR b.user.email <> :email)
    """)
    Page<Book> filterBooks(
            String keyword,
            String location,
            Double minPrice,
            Double maxPrice,
            BookCondition condition,
            String email,
            Pageable pageable
    );

    // Similar books: same condition OR same author, excluding current book
    @Query("""
        SELECT b FROM Book b
        WHERE b.id <> :bookId
        AND (b.condition = :condition OR LOWER(b.author) = LOWER(:author))
        ORDER BY b.id DESC
    """)
    List<Book> findSimilarBooks(int bookId, BookCondition condition, String author, Pageable pageable);
}
