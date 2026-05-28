package com.library.controller;

import com.library.dto.request.IssueRequest;
import com.library.dto.request.ReturnRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.TransactionResponse;
import com.library.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Book issue and return APIs")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/issue")
    @Operation(summary = "Issue a book to a member")
    public ResponseEntity<ApiResponse<TransactionResponse>> issueBook(
            @Valid @RequestBody IssueRequest request) {
        TransactionResponse response = transactionService.issueBook(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book issued successfully", response));
    }

    @PostMapping("/return")
    @Operation(summary = "Return a book")
    public ResponseEntity<ApiResponse<TransactionResponse>> returnBook(
            @Valid @RequestBody ReturnRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Book returned successfully", transactionService.returnBook(request)));
    }

    @GetMapping("/member/{memberId}")
    @Operation(summary = "Get transaction history for a member")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getByMember(
            @PathVariable Long memberId) {
        return ResponseEntity.ok(
                ApiResponse.success(transactionService.getTransactionsByMember(memberId)));
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get transaction history for a book")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getByBook(
            @PathVariable Long bookId) {
        return ResponseEntity.ok(
                ApiResponse.success(transactionService.getTransactionsByBook(bookId)));
    }
}
