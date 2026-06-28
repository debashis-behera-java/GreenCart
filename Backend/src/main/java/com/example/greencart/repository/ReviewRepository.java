package com.example.greencart.repository;

import com.example.greencart.entity.*;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByProduct(Product product);

    List<Review> findByProductOrderByCreatedAtDesc(
            Product product
    );

    boolean existsByUserAndProduct(
            User user,
            Product product
    );
}