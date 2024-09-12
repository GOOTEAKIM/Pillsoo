package org.sos.pillsoo.supplement.service;

import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.entity.Review;
import org.sos.pillsoo.supplement.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MyPageService {

    @Autowired
    private ReviewRepository reviewRepository;

    // 사용자의 리뷰 조회
    public List<ReviewDto> getMyReviews(int userSeq) {
        List<Review> reviews = reviewRepository.findByUserSeq(userSeq);
        return reviews.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setReviewSeq(review.getReviewSeq());
        dto.setSupplementSeq(review.getSupplementSeq());
        dto.setUserSeq(review.getUserSeq());
        dto.setContent(review.getContent());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
