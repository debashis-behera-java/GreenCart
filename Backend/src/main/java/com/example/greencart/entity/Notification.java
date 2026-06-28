package com.example.greencart.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // RECEIVER
    @ManyToOne
    private User user;

    // MESSAGE
    @Column(length = 2000)
    private String message;

    // READ STATUS
    private Boolean isRead = false;

    private LocalDateTime createdAt =
            LocalDateTime.now();
}