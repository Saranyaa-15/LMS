package com.library.controller;

import com.library.dto.request.MemberRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.MemberResponse;
import com.library.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Tag(name = "Members", description = "Member management APIs")
@CrossOrigin(origins = "*")
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    @Operation(summary = "Get all members")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getAllMembers() {
        return ResponseEntity.ok(ApiResponse.success(memberService.getAllMembers()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get member by ID")
    public ResponseEntity<ApiResponse<MemberResponse>> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(memberService.getMemberById(id)));
    }

    @PostMapping
    @Operation(summary = "Register a new member")
    public ResponseEntity<ApiResponse<MemberResponse>> createMember(
            @Valid @RequestBody MemberRequest request) {
        MemberResponse created = memberService.createMember(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Member registered successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update member details")
    public ResponseEntity<ApiResponse<MemberResponse>> updateMember(
            @PathVariable Long id,
            @Valid @RequestBody MemberRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Member updated successfully", memberService.updateMember(id, request)));
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a member")
    public ResponseEntity<ApiResponse<MemberResponse>> deactivateMember(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Member deactivated", memberService.deactivateMember(id)));
    }

    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate a member")
    public ResponseEntity<ApiResponse<MemberResponse>> activateMember(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Member activated", memberService.activateMember(id)));
    }
}
