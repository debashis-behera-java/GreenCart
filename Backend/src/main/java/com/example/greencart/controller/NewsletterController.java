package com.example.greencart.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/newsletter")
public class NewsletterController {

    // In a real app you'd save emails to a database
    @PostMapping("/subscribe")
    public Map<String, String> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        // TODO: save email to DB
        System.out.println("Newsletter subscription: " + email);
        return Map.of("message", "Subscribed successfully");
    }

    @PostMapping("/announce")
    public Map<String, String> announce(@RequestBody Map<String, String> body) {
        // TODO: send email to all subscribers
        System.out.println("Announcement: " + body.get("title"));
        return Map.of("message", "Announcement sent");
    }
}