package com.example.greencart.controller;

import com.example.greencart.entity.*;

import com.example.greencart.repository.*;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistRepository wishlistRepo;

    private final ProductRepository productRepo;

    // ADD TO WISHLIST
    @PostMapping("/add/{productId}")
    public Wishlist add(
            @PathVariable Long productId,
            HttpServletRequest req
    ) {

        User user =
                (User) req.getAttribute("user");

        if (user == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        Product product =
                productRepo.findById(productId)
                        .orElseThrow();

        // PREVENT DUPLICATES
        wishlistRepo.findByUserAndProduct(
                user,
                product
        ).ifPresent(w -> {

            throw new RuntimeException(
                    "Already in wishlist"
            );
        });

        Wishlist wishlist =
                new Wishlist();

        wishlist.setUser(user);

        wishlist.setProduct(product);

        return wishlistRepo.save(wishlist);
    }

    // GET MY WISHLIST
    @GetMapping
    public List<Wishlist> myWishlist(
            HttpServletRequest req
    ) {

        User user =
                (User) req.getAttribute("user");

        if (user == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        return wishlistRepo.findByUser(user);
    }

    // REMOVE WISHLIST ITEM
    @DeleteMapping("/remove/{id}")
    public String remove(
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

        Wishlist wishlist =
                wishlistRepo.findById(id)
                        .orElseThrow();

        if (!wishlist.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Forbidden"
            );
        }

        wishlistRepo.delete(wishlist);

        return "Removed from wishlist";
    }
}