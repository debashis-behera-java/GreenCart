package com.example.greencart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String category;

    private Double price;

    private Double offerPrice;

    private String description;

    private Integer stock;

    private String imageUrl;

    private Boolean active = true;

    @ManyToOne
    private User seller;

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL
    )
    private List<ProductImage> images;

    private Double averageRating = 0.0;

private Integer reviewCount = 0;
}