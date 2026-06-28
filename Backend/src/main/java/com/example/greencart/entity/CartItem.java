package com.example.greencart.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 @ManyToOne
@JoinColumn(name = "cart_id")
@JsonBackReference
private Cart cart;

    @ManyToOne
    private Product product;

    private int qty;
}