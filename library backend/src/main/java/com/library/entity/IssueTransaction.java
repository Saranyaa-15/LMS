package com.library.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_transaction", indexes = {
        @Index(name = "idx_txn_book_id",   columnList = "book_id"),
        @Index(name = "idx_txn_member_id", columnList = "member_id"),
        @Index(name = "idx_txn_status",    columnList = "status"),
        @Index(name = "idx_txn_due_date",  columnList = "due_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "issued_at", nullable = false)
    @CreationTimestamp
    private LocalDateTime issuedAt;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TransactionStatus status = TransactionStatus.ISSUED;

    public boolean isActive() {
        return TransactionStatus.ISSUED.equals(this.status)
                || TransactionStatus.OVERDUE.equals(this.status);
    }

    public boolean isOverdue() {
        return TransactionStatus.OVERDUE.equals(this.status);
    }

    public void markReturned() {
        this.returnedAt = LocalDateTime.now();
        this.status = TransactionStatus.RETURNED;
    }

    public void markOverdue() {
        this.status = TransactionStatus.OVERDUE;
    }
}
