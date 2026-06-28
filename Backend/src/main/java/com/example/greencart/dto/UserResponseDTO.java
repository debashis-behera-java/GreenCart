package com.example.greencart.dto;

import lombok.Data;

@Data
public class UserResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String role;

    private String phone;

    private String avatarUrl;

    private String storeName;

    private boolean verified;
}