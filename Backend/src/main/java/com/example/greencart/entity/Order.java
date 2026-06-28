package com.example.greencart.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who placed order
    @ManyToOne
    private User user;

    

    private String address;

    // COD / UPI
    private String paymentMethod;

    // Pending / Paid / Failed / Refunded
    private String paymentStatus = "Pending";

    private String orderStatus = "Awaiting Payment";

    // Processing / Delivered / Cancelled
  

    private String deliveryOtp;

    private Boolean otpVerified = false;

    // Assigned delivery partner
    @ManyToOne
    private User assignedDelivery;

    // Order items
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<OrderItem> items;

    // Timestamps
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime deliveredAt;

    private Double total;

    private String razorpayOrderId;

private String razorpayPaymentId;

private String deliveryNote;

private String proofImageUrl;
}