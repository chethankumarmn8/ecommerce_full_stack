package com.auth.service;

import com.auth.dto.CheckoutRequest;


import com.auth.model.*;
import com.auth.repository.OrderRepository;
import com.auth.repository.ProductRepository;
import com.auth.repository.UserRepository;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CachedCartService cachedCartService;
    private final RazorpayService razorpayService;
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    @Transactional
    public Order processCheckout(String userEmail, CheckoutRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cachedCartService.getCart(userEmail);

        if (cart == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Double totalAmount = calculateTotal(cart);

        try {
            String receiptId = "order_rcptid_" + System.currentTimeMillis();
            com.razorpay.Order razorpayOrder = razorpayService.createRazorpayOrder(
                    totalAmount,
                    receiptId
            );

            Order order = createOrder(user, request, cart, totalAmount);
            order.setRazorpayOrderId(razorpayOrder.get("id"));
            order.setPaymentStatus("CREATED");

            return orderRepository.save(order);

        } catch (RazorpayException e) {
            log.error("Razorpay processing failed for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }
    }

    @Transactional
    public Order confirmPayment(String paymentId, String orderId, String signature, String email) {
        Order order = orderRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for ID: " + orderId));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            log.warn("Unauthorized payment confirmation attempt for order {}", orderId);
            throw new SecurityException("Unauthorized payment confirmation attempt");
        }

        if (!razorpayService.verifyPaymentSignature(orderId, paymentId, signature)) {
            log.error("Invalid payment signature for order {}", orderId);
            orderRepository.delete(order);
            throw new RuntimeException("Invalid payment signature - Order deleted");
        }

        order.setRazorpayPaymentId(paymentId);
        order.setPaymentStatus("PAID");

        // Reduce stock for each product
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            int newStock = product.getStock() - item.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            product.setStock(newStock);
            productRepository.save(product);
        }

        cachedCartService.clearCart(email);
        return orderRepository.save(order);
    }

    private Order createOrder(User user, CheckoutRequest request, Cart cart, Double totalAmount) {
        Order order = Order.builder()
                .user(user)
                .deliveryAddress(request.getDeliveryAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .phoneNumber(request.getPhoneNumber())
                .items(new ArrayList<>())
                .totalAmount(totalAmount)
                .paymentStatus("CREATED")
                .build();

        List<OrderItem> orderItems = convertCartItems(cart, order);
        order.setItems(orderItems);
        return order;
    }

    private List<OrderItem> convertCartItems(Cart cart, Order order) {
        return cart.getItems().stream().map(cartItem ->
                OrderItem.builder()
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getProduct().getPrice())
                        .order(order)
                        .build()
        ).collect(Collectors.toList());
    }

    private Double calculateTotal(Cart cart) {
        return cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }
}