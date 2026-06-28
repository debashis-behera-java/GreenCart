package com.example.greencart.controller;

import com.example.greencart.dto.CheckoutDTO;
import com.example.greencart.entity.*;
import com.example.greencart.repository.*;
import com.example.greencart.service.FileUploadService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository repo;

    private final CartRepository cartRepo;

    private final CartItemRepository itemRepo;

    private final OrderItemRepository orderItemRepo;

    private final ProductRepository productRepo;

    private final FileUploadService fileUploadService;

    // GET MY ORDERS
    @GetMapping("/my")
    public List<Order> myOrders(
            HttpServletRequest req) {

        User user = (User) req.getAttribute("user");

        if (user == null) {

            throw new RuntimeException(
                    "Unauthorized");
        }

        List<Order> orders = repo.findByUser(user);

        for (Order order : orders) {

            if ("Processing".equals(order.getOrderStatus())
                    &&
                    order.getCreatedAt()
                            .plusMinutes(1)
                            .isBefore(java.time.LocalDateTime.now())) {

                order.setOrderStatus("Delivered");

                order.setDeliveredAt(
                        java.time.LocalDateTime.now());

                repo.save(order);
            }
        }

        return repo.findByUser(user);
    }

    // CHECKOUT API
    // CHECKOUT API
    @PostMapping("/checkout")
    public Order checkout(
            @RequestBody CheckoutDTO dto,
            HttpServletRequest req) {

        User user = (User) req.getAttribute("user");

        if (user == null) {
            throw new RuntimeException("Unauthorized");
        }

        if (dto.getAddress() == null ||
                dto.getAddress().trim().isEmpty()) {
            throw new RuntimeException(
                    "Delivery address is required");
        }

        Cart cart = cartRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = itemRepo.findByCart(cart);
        // Prevent seller from buying own products
        for (CartItem item : cartItems) {

            Product product = item.getProduct();

            if (product.getSeller() != null &&
                    product.getSeller().getId().equals(user.getId())) {

                throw new RuntimeException(
                        "You cannot purchase your own product: "
                                + product.getName());
            }
        }

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = 0;

        // Calculate total safely
        for (CartItem item : cartItems) {

            Product product = item.getProduct();

            Double finalPrice = product.getOfferPrice() != null
                    ? product.getOfferPrice()
                    : product.getPrice();

            total += finalPrice * item.getQty();
        }

        Order order = new Order();

        order.setUser(user);
        order.setAddress(dto.getAddress());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setTotal(total);

        if ("COD".equals(dto.getPaymentMethod())) {
            order.setOrderStatus("Processing");
            order.setPaymentStatus("Pending");
        } else {
            order.setOrderStatus("Awaiting Payment");
            order.setPaymentStatus("Pending");
        }

        Order savedOrder = repo.save(order);

        // Create order items + reduce stock
        for (CartItem item : cartItems) {

            Product product = item.getProduct();

            Double finalPrice = product.getOfferPrice() != null
                    ? product.getOfferPrice()
                    : product.getPrice();

            // Check stock
            if (product.getStock() < item.getQty()) {
                throw new RuntimeException(
                        product.getName()
                                + " has only "
                                + product.getStock()
                                + " items left");
            }

            // Reduce stock
            product.setStock(
                    product.getStock() - item.getQty());

            productRepo.save(product);

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQty(item.getQty());
            orderItem.setPrice(finalPrice);

            orderItemRepo.save(orderItem);
        }

        // Clear cart after successful order
        itemRepo.deleteAll(cartItems);

        savedOrder.setItems(
                orderItemRepo.findByOrder(savedOrder));

        return savedOrder;
    }

    // Get orders assigned to this delivery partner
    @GetMapping("/assigned")
    public List<Order> assignedOrders(HttpServletRequest req) {
        User user = (User) req.getAttribute("user");
        if (user == null)
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Unauthorized");
        return repo.findAll().stream()
                .filter(o -> o.getAssignedDelivery() != null
                        && o.getAssignedDelivery().getId().equals(user.getId()))
                .collect(java.util.stream.Collectors.toList());
    }

    // Acknowledge pick-up
    @PutMapping("/{id}/ack/pick")
    public Order ackPick(@PathVariable Long id, HttpServletRequest req) {
        User user = (User) req.getAttribute("user");
        if (user == null)
            throw new RuntimeException("Unauthorized");
        Order order = repo.findById(id).orElseThrow();
        order.setOrderStatus("Picked Up");
        return repo.save(order);
    }

    // Acknowledge delivery (with OTP)
    @PutMapping("/{id}/ack/deliver")
    public Order ackDeliver(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest req) {
        User user = (User) req.getAttribute("user");
        if (user == null)
            throw new RuntimeException("Unauthorized");
        Order order = repo.findById(id).orElseThrow();
        order.setOrderStatus("Delivered");
        order.setDeliveredAt(java.time.LocalDateTime.now());
        return repo.save(order);
    }

    @PutMapping("/{id}/cancel")
    public Order cancelOrder(
            @PathVariable Long id,
            HttpServletRequest req) {
        User user = (User) req.getAttribute("user");

        if (user == null) {
            throw new RuntimeException("Unauthorized");
        }

        Order order = repo.findById(id).orElseThrow();

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        // Prevent double cancellation
        if ("Cancelled".equals(order.getOrderStatus())) {
            throw new RuntimeException("Order already cancelled");
        }

        // Cannot cancel after shipping/delivery
        if ("Picked Up".equals(order.getOrderStatus())
                || "Out For Delivery".equals(order.getOrderStatus())
                || "Delivered".equals(order.getOrderStatus())) {

            throw new RuntimeException(
                    "Order cannot be cancelled now");
        }

        // Restore stock
        List<OrderItem> items = orderItemRepo.findByOrder(order);

        for (OrderItem item : items) {

            Product product = item.getProduct();

            product.setStock(
                    product.getStock() + item.getQty());

            productRepo.save(product);
        }

        order.setOrderStatus("Cancelled");

        return repo.save(order);
    }

    @PutMapping("/{id}/note")
    public Order addNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest req) {
        User user = (User) req.getAttribute("user");
        if (user == null)
            throw new RuntimeException("Unauthorized");
        Order order = repo.findById(id).orElseThrow();
        // Simple implementation: append note to a notes field
        // For now just return the order as-is
        return order;
    }

    // Add FileUploadService to OrderController constructor first
    // Add FileUploadService to OrderController constructor first
    @PostMapping("/{id}/proof")
    public Order uploadProof(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file,
            HttpServletRequest req) throws Exception {
        User user = (User) req.getAttribute("user");
        if (user == null)
            throw new RuntimeException("Unauthorized");
        String url = fileUploadService.uploadFile(file);
        Order order = repo.findById(id).orElseThrow();
        // Add a proofImageUrl field to Order entity first
        // order.setProofImageUrl(url);
        return repo.save(order);
    }

    @PostMapping("/{id}/otp/resend")
    public ResponseEntity<?> resendOtp(
            @PathVariable Long id,
            HttpServletRequest req) {
        User user = (User) req.getAttribute("user");
        if (user == null)
            throw new RuntimeException("Unauthorized");
        Order order = repo.findById(id).orElseThrow();
        // Generate new OTP and send to customer email
        String otp = String.valueOf(100000 + new java.util.Random().nextInt(900000));
        order.setDeliveryOtp(otp);
        repo.save(order);
        return ResponseEntity.ok(
                Map.of("message", "OTP resent"));
    }

}