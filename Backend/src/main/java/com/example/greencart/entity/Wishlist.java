package com.example.greencart.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // USER
    @ManyToOne
    private User user;

    // PRODUCT
    @ManyToOne
    private Product product;

    private LocalDateTime createdAt =
            LocalDateTime.now();
}