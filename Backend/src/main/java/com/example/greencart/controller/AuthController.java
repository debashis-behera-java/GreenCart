package com.example.greencart.controller;

import com.example.greencart.dto.LoginRequestDTO;
import com.example.greencart.dto.RegisterRequestDTO;
import com.example.greencart.dto.ResetPasswordDTO;
import com.example.greencart.entity.User;
import com.example.greencart.repository.UserRepository;
import com.example.greencart.service.AuthService;
import com.example.greencart.service.EmailService;
import com.example.greencart.service.FileUploadService;
import com.example.greencart.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import jakarta.validation.Valid;



@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;

    private final BCryptPasswordEncoder encoder;

    private final JwtUtil jwtUtil;

    private final AuthService authService;

    private final EmailService emailService;

    private final FileUploadService fileUploadService;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequestDTO request
    ) {

       return ResponseEntity.ok(
        authService.register(request)
);
    }

    // LOGIN
    @PostMapping("/login")
public Object login(
        @Valid @RequestBody LoginRequestDTO req
) {

    User user = userRepo.findByEmail(
            req.getEmail()
    ).orElseThrow(
            () -> new RuntimeException("User not found")
    );

    // Password check
    if (!encoder.matches(
            req.getPassword(),
            user.getPassword()
    )) {

        throw new RuntimeException(
                "Invalid credentials"
        );
    }

    // Email verification check
    if (!user.isVerified()) {

        return ResponseEntity.badRequest()
                .body(
                        Map.of(
                                "message",
                                "Verify email first"
                        )
                );
    }

    // Generate JWT token
    String token = jwtUtil.generateToken(
            user.getId()
    );

    return Map.of(
            "token",
            token
    );
}

    // CURRENT USER
    @GetMapping("/me")
    public Object me(HttpServletRequest req) {

        User user = (User) req.getAttribute("user");

        if (user == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        return authService.userToDTO(user);
    }

@PostMapping("/verify-otp")
public ResponseEntity<?> verifyOtp(
        @RequestParam String email,
        @RequestParam String otp
) {

    User user = userRepo.findByEmail(email)
            .orElseThrow(
                    () -> new RuntimeException(
                            "User not found"
                    )
            );

    System.out.println("Frontend OTP: " + otp);
    System.out.println("Database OTP: " + user.getOtp());

    if (user.getOtp() != null
            && user.getOtp().equals(otp)) {

        user.setVerified(true);

        user.setOtp(null);

        userRepo.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Account verified"
                )
        );
    }

    return ResponseEntity.badRequest()
            .body(
                    Map.of(
                            "message",
                            "Invalid OTP"
                    )
            );
}

    @PostMapping("/request-reset-otp")
public ResponseEntity<?> requestResetOtp(
        @RequestParam String email
) {

    User user = userRepo.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found")
            );

    String otp = String.valueOf(
            100000 + new java.util.Random().nextInt(900000)
    );

    user.setResetOtp(otp);

    user.setResetOtpVerified(false);

    userRepo.save(user);

    emailService.sendOtpEmail(email, otp);

   return ResponseEntity.ok(
        Map.of(
                "message",
                "Reset OTP sent to email"
        )
);
}

@PostMapping("/verify-reset-otp")
public ResponseEntity<?> verifyResetOtp(
        @RequestParam String email,
        @RequestParam String otp
) {

    User user = userRepo.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found")
            );

    if (user.getResetOtp() != null
            && user.getResetOtp().equals(otp)) {

        user.setResetOtpVerified(true);

        userRepo.save(user);

return ResponseEntity.ok(
        Map.of(
                "message",
                "OTP verified"
        )
);
    }

    return ResponseEntity.badRequest()
            .body("Invalid OTP");
}

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(
        @RequestBody ResetPasswordDTO request
) {

    User user = userRepo.findByEmail(
            request.getEmail()
    ).orElseThrow(() ->
            new RuntimeException("User not found")
    );

    if (!user.isResetOtpVerified()) {

        return ResponseEntity.badRequest()
                .body("Verify OTP first");
    }

    user.setPassword(
            encoder.encode(request.getNewPassword())
    );

    user.setResetOtp(null);

    user.setResetOtpVerified(false);

    userRepo.save(user);

   return ResponseEntity.ok(
        Map.of(
                "message",
                "Password reset successful"
        )
);
}

@PutMapping("/profile")
public ResponseEntity<?> updateProfile(
        @RequestBody Map<String, String> body,
        HttpServletRequest req
) {
    User user = (User) req.getAttribute("user");
    if (user == null) throw new RuntimeException("Unauthorized");

    if (body.containsKey("name")) user.setName(body.get("name"));
    if (body.containsKey("phone")) user.setPhone(body.get("phone"));

    String currentPassword = body.get("currentPassword");
    String newPassword = body.get("newPassword");

    if (currentPassword != null && newPassword != null && !newPassword.isEmpty()) {
        if (!encoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }
        user.setPassword(encoder.encode(newPassword));
    }

    userRepo.save(user);
    return ResponseEntity.ok(authService.userToDTO(user));
}

// SAVE ADDRESS
@PutMapping("/address")
public ResponseEntity<?> saveAddress(
        @RequestBody Map<String, String> body,
        HttpServletRequest req
) {
    User user = (User) req.getAttribute("user");
    if (user == null) throw new RuntimeException("Unauthorized");

    user.setAddressFirstName(body.get("firstName"));
    user.setAddressLastName(body.get("lastName"));
    user.setAddressEmail(body.get("email"));
    user.setAddressStreet(body.get("street"));
    user.setAddressCity(body.get("city"));
    user.setAddressState(body.get("state"));
    user.setAddressZipcode(body.get("zipcode"));
    user.setAddressCountry(body.get("country"));
    user.setAddressPhone(body.get("phone"));

    return ResponseEntity.ok(
        Map.of(
                "message",
                "Address saved"
        )
);
}

// GET ADDRESS
@GetMapping("/address")
public ResponseEntity<?> getAddress(HttpServletRequest req) {
    User user = (User) req.getAttribute("user");
    if (user == null) throw new RuntimeException("Unauthorized");

    return ResponseEntity.ok(Map.of(
        "firstName",  user.getAddressFirstName()  != null ? user.getAddressFirstName()  : "",
        "lastName",   user.getAddressLastName()   != null ? user.getAddressLastName()   : "",
        "email",      user.getAddressEmail()      != null ? user.getAddressEmail()      : "",
        "street",     user.getAddressStreet()     != null ? user.getAddressStreet()     : "",
        "city",       user.getAddressCity()       != null ? user.getAddressCity()       : "",
        "state",      user.getAddressState()      != null ? user.getAddressState()      : "",
        "zipcode",    user.getAddressZipcode()    != null ? user.getAddressZipcode()    : "",
        "country",    user.getAddressCountry()    != null ? user.getAddressCountry()    : "",
        "phone",      user.getAddressPhone()      != null ? user.getAddressPhone()      : ""
    ));
}


@PostMapping("/avatar")
public ResponseEntity<?> uploadAvatar(
        @RequestParam("avatar") MultipartFile file,
        HttpServletRequest req
) throws Exception {
    User user = (User) req.getAttribute("user");
    if (user == null) throw new RuntimeException("Unauthorized");

    String url = fileUploadService.uploadFile(file);
    user.setAvatarUrl(url);
    userRepo.save(user);
    return ResponseEntity.ok(authService.userToDTO(user));
}
}