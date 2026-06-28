package com.example.greencart.dto;

import com.example.greencart.entity.CartItem;

import lombok.Data;

import java.util.List;

@Data
public class CartResponseDTO {

    private List<CartItem> items;

    private Double subtotal;

    private Integer totalItems;
}