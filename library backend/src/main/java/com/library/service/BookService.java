package com.library.service;

import com.library.dto.request.BookRequest;
import com.library.dto.response.BookResponse;
import com.library.entity.Book;
import com.library.exception.BusinessRuleException;
import com.library.exception.DuplicateResourceException;
import com.library.exception.ResourceNotFoundException;
import com.library.mapper.BookMapper;
import com.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAllByDeletedFalse()
                .stream()
                .map(bookMapper::toResponse)
                .toList();
    }

    public BookResponse getBookById(Long id) {
        Book book = findActiveBookOrThrow(id);
        return bookMapper.toResponse(book);
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {

        validateIsbnUniqueness(request.getIsbn(), null);
        validateCopiesConsistency(request.getTotalCopies(),request.getAvailableCopies());
        Book book = bookMapper.toEntity(request);
        Book saved = bookRepository.save(book);
        log.info("Book created: id={}, isbn={}", saved.getId(), saved.getIsbn());
        return bookMapper.toResponse(saved);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {

        Book book = findActiveBookOrThrow(id);
        validateIsbnUniqueness(request.getIsbn(), id);
        validateCopiesConsistency(
                request.getTotalCopies(),
                request.getAvailableCopies()
        );
        bookMapper.updateEntityFromRequest(request, book);
        Book saved = bookRepository.save(book);
        log.info("Book updated: id={}", saved.getId());
        return bookMapper.toResponse(saved);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = findActiveBookOrThrow(id);
        book.setDeleted(true);
        bookRepository.save(book);
        log.info("Book soft-deleted: id={}", id);
    }

    public List<BookResponse> searchBooks(String query) {
        if (query == null || query.isBlank()) {
            return getAllBooks();
        }

        return bookRepository.searchBooks(query.trim())
                .stream()
                .map(bookMapper::toResponse)
                .toList();
    }

    private Book findActiveBookOrThrow(Long id) {
        return bookRepository.findByIdAndDeletedFalse(id).orElseThrow(() -> ResourceNotFoundException.forBook(id));
    }

    private void validateIsbnUniqueness(String isbn, Long excludeId) {
        boolean duplicate = (excludeId == null)
                ? bookRepository.existsByIsbnAndDeletedFalse(isbn)
                : bookRepository.existsByIsbnAndIdNotAndDeletedFalse(isbn, excludeId);

        if (duplicate) {
            throw new DuplicateResourceException("A book with ISBN '" + isbn + "' already exists");
        }
    }

    private void validateCopiesConsistency(int totalCopies, int availableCopies) {
        if (availableCopies > totalCopies) {
            throw new BusinessRuleException("Available copies (" + availableCopies + ") cannot exceed total copies (" + totalCopies + ")");
        }
    }
}