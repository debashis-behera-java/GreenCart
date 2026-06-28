package com.example.greencart.util;

import com.example.greencart.entity.User;

public class RoleChecker {

    public static void checkRole(
            User user,
            String... allowedRoles
    ) {

        if (user == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        for (String role : allowedRoles) {

            if (user.getRole() != null
                    && user.getRole()
                    .equalsIgnoreCase(role)) {

                return;
            }
        }

        throw new RuntimeException(
                "Access denied"
        );
    }
}