package com.bookcircle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bookcircle.entity.Book;

public interface BookRepository extends JpaRepository<Book, Integer> {
}