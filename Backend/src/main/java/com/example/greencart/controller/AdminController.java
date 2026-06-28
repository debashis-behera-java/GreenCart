package com.example.greencart.controller;

import com.example.greencart.entity.*;
import com.example.greencart.repository.*;

import com.example.greencart.util.RoleChecker;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.example.greencart.dto.AnalyticsDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepo;

    private final ProductRepository productRepo;

    private final OrderRepository orderRepo;

    // CHECK ADMIN
    private User getAdmin(
            HttpServletRequest req
    ) {

        User admin =
                (User) req.getAttribute("user");

        if (admin == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        RoleChecker.checkRole(
                admin,
                "admin"
        );

        return admin;
    }

    // GET ALL USERS
    @GetMapping("/users")
    public List<User> allUsers(
            HttpServletRequest req
    ) {

        getAdmin(req);

        return userRepo.findAll();
    }

    // GET ALL PRODUCTS
    @GetMapping("/products")
    public List<Product> allProducts(
            HttpServletRequest req
    ) {

        getAdmin(req);

        return productRepo.findAll();
    }

    // GET ALL ORDERS
    @GetMapping("/orders")
    public List<Order> allOrders(
            HttpServletRequest req
    ) {

        getAdmin(req);

        return orderRepo.findAll();
    }

    // CHANGE USER ROLE
    @PutMapping("/users/{id}/role")
    public User changeRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest req
    ) {

        getAdmin(req);

        User user = userRepo.findById(id)
                .orElseThrow();

        user.setRole(
                body.get("role")
        );

        return userRepo.save(user);
    }

    // ANALYTICS DASHBOARD
@GetMapping("/analytics")
public AnalyticsDTO analytics(
        HttpServletRequest req
) {

    getAdmin(req);

    long totalUsers =
            userRepo.count();

    long totalProducts =
            productRepo.count();

    long totalOrders =
            orderRepo.count();

    double totalRevenue =
            orderRepo.findAll()
                    .stream()

                    .filter(order ->
                            "Paid".equals(
                                    order.getPaymentStatus()
                            )
                    )

                    .mapToDouble(order ->
                            order.getTotal() != null
                                    ? order.getTotal()
                                    : 0
                    )

                    .sum();

    return new AnalyticsDTO(
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
    );
}
}