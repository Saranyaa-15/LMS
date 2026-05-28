package com.library.service;

import com.library.dto.request.MemberRequest;
import com.library.dto.response.MemberResponse;
import com.library.entity.Member;
import com.library.exception.DuplicateResourceException;
import com.library.exception.ResourceNotFoundException;
import com.library.mapper.MemberMapper;
import com.library.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MemberService{

    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;

    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll()
                .stream()
                .map(memberMapper::toResponse)
                .toList();
    }

    public MemberResponse getMemberById(Long id) {
        return memberMapper.toResponse(
                findMemberOrThrow(id)
        );
    }

    @Transactional
    public MemberResponse createMember(MemberRequest request) {
        validateEmailUniqueness(request.getEmail(), null);
        Member member = memberMapper.toEntity(request);
        Member saved = memberRepository.save(member);
        log.info(
                "Member created: id={}, email={}",
                saved.getId(),
                saved.getEmail()
        );
        return memberMapper.toResponse(saved);
    }

    @Transactional
    public MemberResponse updateMember(Long id, MemberRequest request) {
        Member member = findMemberOrThrow(id);
        validateEmailUniqueness(request.getEmail(), id);
        memberMapper.updateEntityFromRequest(request,member);
        Member saved = memberRepository.save(member);
        log.info("Member updated: id={}", saved.getId());
        return memberMapper.toResponse(saved);
    }

    @Transactional
    public MemberResponse deactivateMember(Long id) {
        Member member = findMemberOrThrow(id);
        member.deactivate();
        log.info("Member deactivated: id={}", member.getId());
        return memberMapper.toResponse(member);
    }

    @Transactional
    public MemberResponse activateMember(Long id) {
        Member member = findMemberOrThrow(id);
        member.activate();
        log.info("Member activated: id={}", member.getId());
        return memberMapper.toResponse(member);
    }

    private Member findMemberOrThrow(Long id) {
        return memberRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.forMember(id));
    }

    private void validateEmailUniqueness(String email, Long excludeId) {
        boolean duplicate = (excludeId == null)
                ? memberRepository.existsByEmail(email)
                : memberRepository.existsByEmailAndIdNot(email, excludeId);

        if (duplicate) {
            throw new DuplicateResourceException("A member with email '" + email + "' already exists"
            );
        }
    }
}