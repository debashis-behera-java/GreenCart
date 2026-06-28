package com.example.greencart.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer serves;

    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private String prepTime;

    private String cookTime;

    private Boolean active = true;

    @ElementCollection
    private List<RecipeIngredient> ingredients =
            new ArrayList<>();

    @ManyToOne
    private User createdBy;

    private LocalDateTime createdAt =
            LocalDateTime.now();
}