package com.example.greencart.repository;

import com.example.greencart.entity.Cart;
import com.example.greencart.entity.CartItem;
import com.example.greencart.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart(Cart cart);

    Optional<CartItem> findByCartAndProduct(
            Cart cart,
            Product product
    );
}