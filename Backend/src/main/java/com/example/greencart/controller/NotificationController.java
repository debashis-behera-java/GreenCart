package com.example.greencart.controller;

import com.example.greencart.dto.NotificationDTO;

import com.example.greencart.entity.*;

import com.example.greencart.repository.*;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepo;

    private final UserRepository userRepo;

    // SEND NOTIFICATION
    @PostMapping("/send")
    public Notification send(
            @RequestBody NotificationDTO dto
    ) {

        User user =
                userRepo.findById(
                        dto.getUserId()
                ).orElseThrow();

        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setMessage(
                dto.getMessage()
        );

        return notificationRepo.save(
                notification
        );
    }

    // MY NOTIFICATIONS
    @GetMapping("/my")
    public List<Notification> myNotifications(
            HttpServletRequest req
    ) {

        User user =
                (User) req.getAttribute("user");

        if (user == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        return notificationRepo
                .findByUserOrderByCreatedAtDesc(
                        user
                );
    }

    // MARK AS READ
    @PutMapping("/read/{id}")
    public Notification markRead(
            @PathVariable Long id,
            HttpServletRequest req
    ) {

        User user =
                (User) req.getAttribute("user");

        if (user == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        Notification notification =
                notificationRepo.findById(id)
                        .orElseThrow();

        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Forbidden"
            );
        }

        notification.setIsRead(true);

        return notificationRepo.save(
                notification
        );
    }
}