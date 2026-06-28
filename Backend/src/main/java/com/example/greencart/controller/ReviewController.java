package com.example.greencart.controller;

import com.example.greencart.dto.ReviewDTO;

import com.example.greencart.entity.*;

import com.example.greencart.repository.*;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewController {

        private final ReviewRepository reviewRepo;

        private final ProductRepository productRepo;

        // ADD REVIEW
        @PostMapping
        public Review addReview(
                        @RequestBody ReviewDTO dto,
                        HttpServletRequest req) {

                User user = (User) req.getAttribute("user");

                if (user == null) {

                        throw new RuntimeException(
                                        "Unauthorized");
                }

                Product product = productRepo.findById(
                                dto.getProductId()).orElseThrow();
                if (reviewRepo.existsByUserAndProduct(
                                user,
                                product)) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "You already reviewed this product");
                }

                Review review = new Review();

                review.setUser(user);

                review.setProduct(product);

                review.setRating(
                                dto.getRating());

                review.setComment(
                                dto.getComment());

                Review savedReview = reviewRepo.save(review);

                // GET ALL PRODUCT REVIEWS
                // GET ALL PRODUCT REVIEWS
                List<Review> reviews = reviewRepo.findByProductOrderByCreatedAtDesc(
                                product);

                // CALCULATE AVERAGE
                double avg = reviews.stream()
                                .mapToInt(Review::getRating)
                                .average()
                                .orElse(0.0);

                // UPDATE PRODUCT
                product.setAverageRating(avg);

                product.setReviewCount(
                                reviews.size());

                productRepo.save(product);

                return savedReview;
        }

        // GET PRODUCT REVIEWS
        @GetMapping("/product/{id}")
        public List<Review> productReviews(
                        @PathVariable Long id) {

                Product product = productRepo.findById(id)
                                .orElseThrow();

                return reviewRepo
                                .findByProductOrderByCreatedAtDesc(
                                                product);
        }

        @GetMapping("/check/{productId}")
        public boolean hasReviewed(
                        @PathVariable Long productId,
                        HttpServletRequest req) {

                User user = (User) req.getAttribute("user");

                if (user == null) {
                        return false;
                }

                Product product = productRepo.findById(productId)
                                .orElseThrow();

                return reviewRepo.existsByUserAndProduct(
                                user,
                                product);
        }
}