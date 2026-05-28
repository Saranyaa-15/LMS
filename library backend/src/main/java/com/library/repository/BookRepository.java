package com.library.repository;

import com.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByIsbnAndDeletedFalse(String isbn);
    boolean existsByIsbnAndIdNotAndDeletedFalse(String isbn, Long id);

    Optional<Book> findByIdAndDeletedFalse(Long id);
    List<Book> findAllByDeletedFalse();

    @Query("""
        SELECT b FROM Book b
        WHERE b.deleted = false
          AND (
              LOWER(b.title)    LIKE LOWER(CONCAT('%', :query, '%')) OR
              LOWER(b.author)   LIKE LOWER(CONCAT('%', :query, '%')) OR
              LOWER(b.isbn)     LIKE LOWER(CONCAT('%', :query, '%')) OR
              LOWER(b.category) LIKE LOWER(CONCAT('%', :query, '%'))
          )
        """)
    List<Book> searchBooks(@Param("query") String query);
}
