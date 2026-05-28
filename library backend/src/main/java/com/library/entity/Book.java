package com.library.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "book", indexes = {
        @Index(name = "idx_book_isbn",     columnList = "isbn"),
        @Index(name = "idx_book_title",    columnList = "title"),
        @Index(name = "idx_book_category", columnList = "category")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, unique = true, length = 20)
    private String isbn;

    @Column(length = 100)
    private String category;

    @Column(name = "total_copies", nullable = false)
    private int totalCopies;

    @Column(name = "available_copies", nullable = false)
    private int availableCopies;

    @Column(name = "shelf_location", length = 50)
    private String shelfLocation;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<IssueTransaction> transactions = new ArrayList<>();

    public void decreaseAvailableCopies() {
        if (this.availableCopies <= 0) {
            throw new IllegalStateException("No copies available to issue");
        }
        this.availableCopies--;
    }

    public void increaseAvailableCopies() {
        if (this.availableCopies >= this.totalCopies) {
            throw new IllegalStateException("Available copies cannot exceed total copies");
        }
        this.availableCopies++;
    }
}
