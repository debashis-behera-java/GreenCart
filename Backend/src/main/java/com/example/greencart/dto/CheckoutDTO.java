package com.example.greencart.dto;

import lombok.Data;

@Data
public class CheckoutDTO {

    private String address;

    private String paymentMethod;
}