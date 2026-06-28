package com.example.greencart.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {

    private Long totalUsers;

    private Long totalProducts;

    private Long totalOrders;

    private Double totalRevenue;
}