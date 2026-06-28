package com.example.greencart.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class RecipeIngredient {

    private String productId;

    private String name;

    private String unit;

    private Double qtyPerServe;
}