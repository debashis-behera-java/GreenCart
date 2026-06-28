package com.example.greencart.repository;

import com.example.greencart.entity.Cart;
import com.example.greencart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}