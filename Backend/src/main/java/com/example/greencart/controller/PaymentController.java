package com.example.greencart.controller;

import com.example.greencart.service.RazorpayService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.greencart.dto.PaymentVerifyDTO;
import com.example.greencart.entity.Order;
import com.example.greencart.repository.OrderRepository;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentController {

    private final RazorpayService razorpayService;

    private final OrderRepository orderRepo;

   @PostMapping("/create-order")
public ResponseEntity<String> createOrder(
        @RequestParam Double amount
) throws Exception {

    return ResponseEntity.ok(
            razorpayService.createOrder(amount)
    );
}


 @PostMapping("/verify")
public ResponseEntity<?> verifyPayment(
        @RequestBody PaymentVerifyDTO dto
) throws Exception {

    boolean valid =
            razorpayService.verifyPayment(
                    dto.getRazorpayOrderId(),
                    dto.getRazorpayPaymentId(),
                    dto.getRazorpaySignature()
            );

    if (!valid) {

        throw new RuntimeException(
                "Invalid payment signature"
        );
    }

    Order order =
            orderRepo.findById(dto.getOrderId())
                    .orElseThrow();

    order.setPaymentStatus("Paid");

    order.setOrderStatus("Confirmed");

    order.setRazorpayOrderId(
            dto.getRazorpayOrderId()
    );

    order.setRazorpayPaymentId(
            dto.getRazorpayPaymentId()
    );

    orderRepo.save(order);

    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Payment verified"
            )
    );
}
}