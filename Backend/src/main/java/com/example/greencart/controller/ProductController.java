package com.example.greencart.controller;

import com.example.greencart.entity.Product;
import com.example.greencart.repository.ProductRepository;
import com.example.greencart.service.FileUploadService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.greencart.util.RoleChecker;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;
import java.util.List;


import com.example.greencart.entity.User;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository repo;
    private final FileUploadService fileUploadService;

    @GetMapping
    public List<Product> all() {
        return repo.findAll();
    }

    @GetMapping("/categories")
public List<String> categories() {
    return repo.findDistinctCategories();
}

    @PostMapping(
        consumes = "multipart/form-data"
)
public Product create(

        HttpServletRequest request,

        @RequestParam String name,

        @RequestParam Double price,

        @RequestParam Integer stock,

        @RequestParam String category,

        @RequestParam(required = false)
        String description,

        @RequestParam(required = false)
        MultipartFile file

) throws Exception {

    User user =
            (User) request.getAttribute("user");

    RoleChecker.checkRole(
            user,
            "seller",
            "admin"
    );

    Product p = new Product();

    p.setName(name);

    p.setPrice(price);

    p.setStock(stock);

    p.setCategory(category);

    p.setDescription(description);

    p.setSeller(user);

    // IMAGE
    if (file != null && !file.isEmpty()) {

        String url =
                fileUploadService.uploadFile(file);

        p.setImageUrl(url);
    }

    return repo.save(p);
}
    @PostMapping("/upload")
public ResponseEntity<?> uploadImage(
        @RequestParam("file") MultipartFile file
) {

    try {

        String url = fileUploadService
                .uploadFile(file);

        return ResponseEntity.ok(
                Map.of("url", url)
        );

    } catch (Exception e) {

    e.printStackTrace();

    throw new RuntimeException(
            e.getMessage()
    );
}
}

@GetMapping("/{id}")
public ResponseEntity<Product> getById(@PathVariable Long id) {
    return repo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

@GetMapping("/mine")
public List<Product> mine(HttpServletRequest request) {
    User user = (User) request.getAttribute("user");
    if (user == null) throw new RuntimeException("Unauthorized");
    RoleChecker.checkRole(user, "seller", "admin");
    return repo.findBySeller(user);
}

@PutMapping("/{id}/stock")
public Product updateStock(
        @PathVariable Long id,
        @RequestBody Map<String, Integer> body,
        HttpServletRequest request
) {
    User user = (User) request.getAttribute("user");
    if (user == null) throw new RuntimeException("Unauthorized");
    RoleChecker.checkRole(user, "seller", "admin");
    Product product = repo.findById(id).orElseThrow();
    product.setStock(body.get("stock"));
    return repo.save(product);
}

@DeleteMapping("/{id}")
public String deleteProduct(
        @PathVariable Long id,
        HttpServletRequest request
) {
    User user = (User) request.getAttribute("user");
    if (user == null) throw new RuntimeException("Unauthorized");
    RoleChecker.checkRole(user, "seller", "admin");
    repo.deleteById(id);
    return "Product deleted";
}


}