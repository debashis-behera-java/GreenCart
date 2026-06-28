package com.example.greencart.controller;

import com.example.greencart.entity.*;
import com.example.greencart.repository.*;

import com.example.greencart.util.RoleChecker;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/seller")
public class SellerController {

    private final OrderRepository orderRepo;
  

    // GET SELLER ORDERS
    @GetMapping("/orders")
    public List<Order> sellerOrders(
            HttpServletRequest req
    ) {

        User seller =
                (User) req.getAttribute("user");

        if (seller == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        RoleChecker.checkRole(
                seller,
                "seller",
                "admin"
        );

        List<Order> allOrders =
                orderRepo.findAll();

        List<Order> sellerOrders =
                new ArrayList<>();

        for (Order order : allOrders) {

            boolean hasSellerProduct = false;

            for (OrderItem item : order.getItems()) {

                if (
                        item.getProduct()
                                .getSeller() != null

                        &&

                        item.getProduct()
                                .getSeller()
                                .getId()
                                .equals(seller.getId())
                ) {

                    hasSellerProduct = true;

                    break;
                }
            }

            if (hasSellerProduct) {

                sellerOrders.add(order);
            }
        }

        return sellerOrders;
    }

    // UPDATE ORDER STATUS
    @PutMapping("/orders/{id}/status")
    public Order updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest req
    ) {

        User seller =
                (User) req.getAttribute("user");

        if (seller == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        RoleChecker.checkRole(
                seller,
                "seller",
                "admin"
        );

        Order order = orderRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        order.setOrderStatus(
                body.get("status")
        );

        return orderRepo.save(order);
    }

    @PutMapping("/orders/{id}/assign")
public Order assignDelivery(
        @PathVariable Long id,
        @RequestBody Map<String, String> body,
        HttpServletRequest req
) {
    User seller = (User) req.getAttribute("user");
    if (seller == null) throw new RuntimeException("Unauthorized");
    RoleChecker.checkRole(seller, "seller", "admin");

    Order order = orderRepo.findById(id).orElseThrow();
    // You need UserRepository here — add it to the constructor
    // User delivery = userRepo.findByEmail(body.get("deliveryEmail")).orElseThrow();
    // order.setAssignedDelivery(delivery);
    order.setOrderStatus("Out for Delivery");
    return orderRepo.save(order);
}
}