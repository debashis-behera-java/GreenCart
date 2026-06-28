package com.example.greencart.controller;

import com.example.greencart.dto.CouponDTO;

import com.example.greencart.entity.*;

import com.example.greencart.repository.*;

import com.example.greencart.util.RoleChecker;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepo;

    // CREATE COUPON (ADMIN)
    @PostMapping("/admin/coupons")
    public Coupon createCoupon(
            @RequestBody Coupon coupon,
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

        return couponRepo.save(coupon);
    }

    // GET ALL COUPONS
    @GetMapping("/coupons")
    public List<Coupon> allCoupons() {

        return couponRepo.findAll();
    }

    // APPLY COUPON
    @PostMapping("/coupons/apply")
    public Map<String, Object> applyCoupon(
            @RequestBody CouponDTO dto
    ) {

        Coupon coupon =
                couponRepo.findByCode(
                        dto.getCode()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Invalid coupon"
                        )
                );

        // CHECK ACTIVE
        if (!coupon.getActive()) {

            throw new RuntimeException(
                    "Coupon inactive"
            );
        }

        // CHECK EXPIRY
        if (coupon.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Coupon expired"
            );
        }

        // CHECK MIN AMOUNT
        if (dto.getAmount()
                < coupon.getMinAmount()) {

            throw new RuntimeException(
                    "Minimum amount not reached"
            );
        }

        // CALCULATE DISCOUNT
        double discount =
                dto.getAmount()
                        * coupon.getDiscountPercent()
                        / 100;

        double finalAmount =
                dto.getAmount() - discount;

        return Map.of(
                "originalAmount",
                dto.getAmount(),

                "discount",
                discount,

                "finalAmount",
                finalAmount,

                "coupon",
                coupon.getCode()
        );
    }
}