package com.example.greencart.repository;

import com.example.greencart.entity.Recipe;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository
        extends JpaRepository<Recipe, Long> {

    List<Recipe> findByActiveTrueOrderByCreatedAtDesc();
}