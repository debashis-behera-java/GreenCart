package com.example.greencart.service;

import com.example.greencart.dto.RegisterRequestDTO;
import com.example.greencart.dto.UserResponseDTO;
import com.example.greencart.entity.User;
import com.example.greencart.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;

    private final BCryptPasswordEncoder encoder;

    private final EmailService emailService;

    public UserResponseDTO register(RegisterRequestDTO request) {

        // Check existing user
        User existingUser = userRepo
                .findByEmail(request.getEmail())
                .orElse(null);

        // If already verified
        if (existingUser != null && existingUser.isVerified()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Generate OTP
        String otp = String.valueOf(
                100000 + new Random().nextInt(900000)
        );

        // Existing but not verified
       if (existingUser != null) {

    throw new RuntimeException(
            "Email already registered"
    );
}
        // Create new user
        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(
                encoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        user.setOtp(otp);

        user.setVerified(true);

        // Save user
        User savedUser = userRepo.save(user);

        // Send OTP email
        emailService.sendOtpEmail(
                user.getEmail(),
                otp
        );

       return userToDTO(savedUser);
    }

    // Convert User -> UserResponseDTO
    public UserResponseDTO userToDTO(User user) {

        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());

        dto.setName(user.getName());

        dto.setEmail(user.getEmail());

        dto.setRole(user.getRole());

        dto.setPhone(user.getPhone());

        dto.setAvatarUrl(user.getAvatarUrl());

        dto.setStoreName(user.getStoreName());

        dto.setVerified(user.isVerified());

        return dto;
    }
}