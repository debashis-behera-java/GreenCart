package com.example.greencart.repository;

import com.example.greencart.entity.Order;
import com.example.greencart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}