package com.auth.controller;

import com.auth.dto.CartDTO;
import com.auth.model.Cart;
import com.auth.service.CachedCartService;
import com.auth.service.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CachedCartService cachedCartService;
    private final JwtUtil jwtUtil;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity,
            @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        return ResponseEntity.ok(cachedCartService.addToCart(email, productId, quantity));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable Long itemId,
            @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        return ResponseEntity.ok(cachedCartService.removeFromCart(email, itemId));
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        Cart cart = cachedCartService.getCart(email);
        return ResponseEntity.ok(new CartDTO(cart));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> request,
            @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        int quantity = request.get("quantity");
        return ResponseEntity.ok(cachedCartService.updateCartItem(email, itemId, quantity));
    }
}