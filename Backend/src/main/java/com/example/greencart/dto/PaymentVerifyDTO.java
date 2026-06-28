package com.example.greencart.dto;

import lombok.Data;

@Data
public class PaymentVerifyDTO {

    private Long orderId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;
}