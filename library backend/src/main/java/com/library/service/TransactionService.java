package com.library.service;

import com.library.dto.request.IssueRequest;
import com.library.dto.request.ReturnRequest;
import com.library.dto.response.TransactionResponse;
import com.library.entity.Book;
import com.library.entity.IssueTransaction;
import com.library.entity.Member;
import com.library.entity.TransactionStatus;
import com.library.exception.BusinessRuleException;
import com.library.exception.ResourceNotFoundException;
import com.library.mapper.TransactionMapper;
import com.library.repository.BookRepository;
import com.library.repository.IssueTransactionRepository;
import com.library.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TransactionService{

    private static final int LOAN_PERIOD_DAYS = 14;

    private final IssueTransactionRepository transactionRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final TransactionMapper transactionMapper;


//      Issues a book to a member

    @Transactional
    public TransactionResponse issueBook(IssueRequest request) {

        Member member =findActiveMemberOrThrow(request.getMemberId());
        Book book = findActiveBookOrThrow(request.getBookId());
        validateBookAvailability(book);

        preventDuplicateIssue(book.getId(), member.getId());
        book.decreaseAvailableCopies();
        LocalDateTime now = LocalDateTime.now();

        IssueTransaction transaction = IssueTransaction.builder()
                        .book(book)
                        .member(member)
                        .issuedAt(now)
                        .dueDate(now.plusDays(LOAN_PERIOD_DAYS))
                        .status(TransactionStatus.ISSUED)
                        .build();

        IssueTransaction saved = transactionRepository.save(transaction);

        log.info("Book issued: transactionId={}, bookId={}, memberId={}",
                saved.getId(),
                book.getId(),
                member.getId());
        return transactionMapper.toResponse(saved);
    }

//      Returns a previously issued book

    @Transactional
    public TransactionResponse returnBook(ReturnRequest request) {

        IssueTransaction transaction = findTransactionOrThrow(request.getTransactionId());
        if (!transaction.isActive()) {
            throw new BusinessRuleException("Transaction " + request.getTransactionId() + " is already returned");
        }
        transaction.markReturned();
        transaction.getBook().increaseAvailableCopies();
        log.info(
                "Book returned: transactionId={}, bookId={}, memberId={}",
                transaction.getId(),
                transaction.getBook().getId(),
                transaction.getMember().getId()
        );

        return transactionMapper.toResponse(transaction);
    }

    public List<TransactionResponse> getTransactionsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw ResourceNotFoundException.forMember(memberId);
        }

        return transactionRepository
                .findAllByMemberIdOrderByIssuedAtDesc(memberId)
                .stream()
                .map(transactionMapper::toResponse)
                .toList();
    }

    public List<TransactionResponse> getTransactionsByBook(Long bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw ResourceNotFoundException.forBook(bookId);
        }
        return transactionRepository
                .findAllByBookIdOrderByIssuedAtDesc(bookId)
                .stream()
                .map(transactionMapper::toResponse)
                .toList();
    }

    // Private Helpers
    private Member findActiveMemberOrThrow(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> ResourceNotFoundException.forMember(memberId));

        if (!member.isActive()) {
            throw new BusinessRuleException("Member " + memberId + " is INACTIVE and cannot issue books");
        }

        return member;
    }

    private Book findActiveBookOrThrow(Long bookId) {

        return bookRepository.findByIdAndDeletedFalse(bookId)
                .orElseThrow(() -> ResourceNotFoundException.forBook(bookId));
    }

    private void validateBookAvailability(Book book) {

        if (book.getAvailableCopies() <= 0) {
            throw new BusinessRuleException("No copies available for book: '" + book.getTitle() + "'");
        }
    }

    private void preventDuplicateIssue(Long bookId, Long memberId) {

        boolean alreadyIssued = transactionRepository.existsActiveTransactionForBookAndMember(bookId, memberId);
        if (alreadyIssued) {
            throw new BusinessRuleException("Member already has an active issue for this book. " + "Please return it before re-issuing.");
        }
    }

    private IssueTransaction findTransactionOrThrow(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() ->ResourceNotFoundException.forTransaction(id));
    }
}