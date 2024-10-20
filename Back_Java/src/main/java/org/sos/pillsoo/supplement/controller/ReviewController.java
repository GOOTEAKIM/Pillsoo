package org.sos.pillsoo.supplement.controller;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.service.ReviewService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/supplement/{supplementSeq}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<ReviewDto> getReviews(@PathVariable int supplementSeq) {
        return reviewService.getReviews(supplementSeq);
    }

    @PostMapping
    public ReviewDto addReview(@PathVariable int supplementSeq, @RequestBody ReviewDto reviewDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        return reviewService.addReview(supplementSeq, userSeq, reviewDto);
    }

    @DeleteMapping
    public void deleteReview(@PathVariable int supplementSeq, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        reviewService.deleteReview(supplementSeq, userSeq);
    }

    @PatchMapping
    public ReviewDto updateReviewContent(@PathVariable int supplementSeq, @RequestBody ReviewDto reviewDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        return reviewService.updateReviewContent(supplementSeq, userSeq, reviewDto);
    }
}
