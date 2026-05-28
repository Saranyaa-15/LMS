package com.library.dto.response;

import com.library.entity.MemberStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MemberResponse {
    private Long id;
    private String name;
    private String email;
    private MemberStatus status;
    private LocalDateTime createdAt;
}
