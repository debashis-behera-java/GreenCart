package com.example.greencart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String name;

   @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private String password;

    private String role = "user"; // user, seller, admin, delivery

    private String phone;

    private String avatarUrl;

    private String storeName; // only for seller

    private boolean verified = false;

    // Shipping Address
private String addressStreet;
private String addressCity;
private String addressState;
private String addressZipcode;
private String addressCountry;
private String addressFirstName;
private String addressLastName;
private String addressPhone;
private String addressEmail;

@JsonIgnore
private String otp;

@JsonIgnore
private LocalDateTime otpExpiry;

@JsonIgnore
private String resetOtp;

@JsonIgnore
private boolean resetOtpVerified = false;
}