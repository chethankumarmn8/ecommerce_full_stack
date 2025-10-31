package com.auth.controller;

import com.auth.dto.CheckoutRequest;
import com.auth.model.Order;
import com.auth.service.JwtUtil;
import com.auth.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {
    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> checkout(
            @RequestBody @Valid CheckoutRequest request,
            @RequestHeader("Authorization") String token) {

        try {
            String email = getEmailFromToken(token);
            Order order = orderService.processCheckout(email, request);
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            return buildErrorResponse("Checkout failed", e, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody Map<String, String> paymentData,
            @RequestHeader("Authorization") String token) {

        try {
            String email = getEmailFromToken(token);
            Order order = orderService.confirmPayment(
                    paymentData.get("paymentId"),
                    paymentData.get("orderId"),
                    paymentData.get("signature"),
                    email
            );
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            return buildErrorResponse("Payment verification failed", e, HttpStatus.BAD_REQUEST);
        }
    }

    private String getEmailFromToken(String token) {
        return jwtUtil.extractUsername(token.substring(7));
    }

    private ResponseEntity<Map<String, String>> buildErrorResponse(String error, Exception e, HttpStatus status) {
        String message = e != null ? e.getMessage() : "Unknown error";
        return ResponseEntity.status(status)
                .body(Map.of("error", error, "message", message));
    }

}