package com.library.repository;

import com.library.entity.IssueTransaction;
import com.library.entity.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueTransactionRepository extends JpaRepository<IssueTransaction, Long> {

    List<IssueTransaction> findAllByMemberIdOrderByIssuedAtDesc(Long memberId);
    List<IssueTransaction> findAllByBookIdOrderByIssuedAtDesc(Long bookId);

//     Check if an active transaction exists for the same book and member.
    @Query("""
        SELECT COUNT(t) > 0 FROM IssueTransaction t
        WHERE t.book.id   = :bookId
          AND t.member.id = :memberId
          AND t.status IN ('ISSUED', 'OVERDUE')
        """)
    boolean existsActiveTransactionForBookAndMember(
            @Param("bookId")   Long bookId,
            @Param("memberId") Long memberId
    );


}
