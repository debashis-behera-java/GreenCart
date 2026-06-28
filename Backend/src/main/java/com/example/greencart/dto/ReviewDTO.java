package com.example.greencart.dto;

import lombok.Data;

@Data
public class ReviewDTO {

    private Long productId;

    private Integer rating;

    private String comment;
}