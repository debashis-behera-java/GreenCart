package com.example.greencart.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // REVIEW USER
    @ManyToOne
    private User user;

    // REVIEW PRODUCT
    @ManyToOne
    private Product product;

    // 1-5 STAR
    private Integer rating;

    // REVIEW MESSAGE
    @Column(length = 2000)
    private String comment;

    private LocalDateTime createdAt =
            LocalDateTime.now();
}