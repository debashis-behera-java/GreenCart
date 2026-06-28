package com.example.greencart.security;

import com.example.greencart.entity.User;
import com.example.greencart.repository.UserRepository;
import com.example.greencart.util.JwtUtil;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtFilter implements Filter {

    private final JwtUtil jwtUtil;

    private final UserRepository userRepo;

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {

        HttpServletRequest req =
                (HttpServletRequest) request;

        String header =
                req.getHeader("Authorization");

        if (header != null
                && header.startsWith("Bearer ")) {

            String token =
                    header.substring(7);

            try {

                Long userId =
                        jwtUtil.extractUserId(token);

                User user = userRepo
                        .findById(userId)
                        .orElse(null);

                if (user != null) {

                    // FOR CONTROLLERS
                    req.setAttribute("user", user);

                    // FOR SPRING SECURITY
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    Collections.emptyList()
                            );

                    auth.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(req)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(auth);
                }

            } catch (Exception e) {

                e.printStackTrace();
            }
        }

        chain.doFilter(request, response);
    }
}