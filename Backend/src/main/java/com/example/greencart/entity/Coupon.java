package com.example.greencart.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // COUPON CODE
    @Column(unique = true)
    private String code;

    // DISCOUNT %
    private Double discountPercent;

    // MIN ORDER AMOUNT
    private Double minAmount;

    // ACTIVE?
    private Boolean active = true;

    // EXPIRY
    private LocalDateTime expiryDate;

    private LocalDateTime createdAt =
            LocalDateTime.now();
}