package com.bookcircle.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bookcircle.entity.Book;
import com.bookcircle.entity.Customer;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByUser(Customer user);
    List<Book> findByUserNot(Customer user);
    
    // Custom filter with pagination
    @Query("""
        SELECT b FROM Book b
        WHERE (:keyword IS NULL OR :keyword = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:minPrice IS NULL OR b.price >= :minPrice)
        AND (:maxPrice IS NULL OR b.price <= :maxPrice)
        AND (:condition IS NULL OR :condition = '' OR b.condition = :condition)
    """)
    Page<Book> filterBooks(
            String keyword,
            Double minPrice,
            Double maxPrice,
            String condition,
            Pageable pageable
    );
}