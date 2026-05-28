package com.library.mapper;

import com.library.dto.response.TransactionResponse;
import com.library.entity.IssueTransaction;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TransactionMapper {

    @Mapping(target = "bookId",      source = "book.id")
    @Mapping(target = "bookTitle",   source = "book.title")
    @Mapping(target = "bookIsbn",    source = "book.isbn")
    @Mapping(target = "memberId",    source = "member.id")
    @Mapping(target = "memberName",  source = "member.name")
    @Mapping(target = "memberEmail", source = "member.email")
    TransactionResponse toResponse(IssueTransaction transaction);
}
