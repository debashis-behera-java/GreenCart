package com.example.greencart.controller;

import com.example.greencart.dto.AddToCartDTO;
import com.example.greencart.dto.CartResponseDTO;
import com.example.greencart.dto.UpdateCartDTO;
import com.example.greencart.entity.*;
import com.example.greencart.repository.*;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;



import java.util.List;



@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {

    private final CartRepository cartRepo;
    private final CartItemRepository itemRepo;
    private final ProductRepository productRepo;

   @GetMapping
public CartResponseDTO getCart(
        HttpServletRequest req
) {

    User user = (User) req.getAttribute("user");

    if (user == null) {

        throw new RuntimeException(
                "Unauthorized"
        );
    }

    Cart cart = cartRepo.findByUser(user)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Cart not found"
                    )
            );

    List<CartItem> items =
            itemRepo.findByCart(cart);

    double subtotal = 0;

    int totalItems = 0;

    for (CartItem item : items) {

    Product product = item.getProduct();

    double price =
            product.getOfferPrice() != null
                    ? product.getOfferPrice()
                    : product.getPrice();

    subtotal += price * item.getQty();

    totalItems += item.getQty();
}

    CartResponseDTO dto =
            new CartResponseDTO();

    dto.setItems(items);

    dto.setSubtotal(subtotal);

    dto.setTotalItems(totalItems);

    return dto;
}

   @PostMapping("/add")
public CartItem add(
        @RequestBody AddToCartDTO body,
        HttpServletRequest req
) {

    User user = (User) req.getAttribute("user");

    if (user == null) {
        throw new RuntimeException(
                "Unauthorized"
        );
    }

    Product product = productRepo
            .findById(body.getProductId())
            .orElseThrow();

    Cart cart = cartRepo.findByUser(user)
            .orElseGet(() -> {

                Cart c = new Cart();

                c.setUser(user);

                return cartRepo.save(c);
            });

    // Check existing cart item
    CartItem existingItem =
            itemRepo.findByCartAndProduct(
                    cart,
                    product
            ).orElse(null);

    // Increase quantity if exists
   if (existingItem != null) {

    int newQty =
            existingItem.getQty()
                    + body.getQuantity();

    if (newQty > product.getStock()) {
        throw new RuntimeException(
                "Not enough stock available"
        );
    }

    existingItem.setQty(newQty);

    return itemRepo.save(existingItem);
}

    // Create new cart item
    CartItem item = new CartItem();

    item.setCart(cart);

    item.setProduct(product);

    item.setQty(body.getQuantity());

    return itemRepo.save(item);
}

@PutMapping("/item/{id}")
public CartItem updateQty(
        @PathVariable Long id,
        @RequestBody UpdateCartDTO body,
        HttpServletRequest req
) {

    User user = (User) req.getAttribute("user");

    if (user == null) {

        throw new RuntimeException(
                "Unauthorized"
        );
    }

    CartItem item = itemRepo.findById(id)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Cart item not found"
                    )
            );

    // Security check
    if (!item.getCart()
            .getUser()
            .getId()
            .equals(user.getId())) {

        throw new RuntimeException(
                "Access denied"
        );
    }

    item.setQty(body.getQty());

    return itemRepo.save(item);
}

@DeleteMapping("/item/{id}")
public String removeItem(
        @PathVariable Long id,
        HttpServletRequest req
) {

    User user = (User) req.getAttribute("user");

    if (user == null) {

        throw new RuntimeException(
                "Unauthorized"
        );
    }

    CartItem item = itemRepo.findById(id)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Cart item not found"
                    )
            );

    // Security check
    if (!item.getCart()
            .getUser()
            .getId()
            .equals(user.getId())) {

        throw new RuntimeException(
                "Access denied"
        );
    }

    itemRepo.delete(item);

    return "Item removed from cart";
}
}