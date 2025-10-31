package com.auth.controller;

import com.auth.model.Order;
import com.auth.repository.OrderRepository;
import com.razorpay.Utils;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final OrderRepository orderRepository;

    @Value("${razorpay.webhook-secret}")
    private String webhookSecret;

    public WebhookController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping(value = "/razorpay/webhook", consumes = "application/json")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public String handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String sigHeader) {

        if (sigHeader == null || sigHeader.isEmpty()) {
            log.error("Missing X-Razorpay-Signature header");
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Missing X-Razorpay-Signature header"
            );
        }

        try {
            if (!Utils.verifyWebhookSignature(payload, sigHeader, webhookSecret)) {
                log.error("Invalid webhook signature");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid signature");
            }

            JSONObject eventData = new JSONObject(payload);
            String eventType = eventData.getString("event");

            if ("payment.captured".equals(eventType)) {
                handleSuccessfulPayment(eventData);
            } else if ("payment.failed".equals(eventType)) {
                handleFailedPayment(eventData);
            }

            return "OK";
        } catch (JSONException e) {
            log.error("Invalid JSON payload", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payload");
        } catch (Exception e) {
            log.error("Webhook processing error", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing webhook");
        }
    }

    private void handleSuccessfulPayment(JSONObject eventData) {
        JSONObject payment = eventData.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
        String orderId = payment.getString("order_id");

        Order order = orderRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for Razorpay ID: " + orderId));

        if (!"PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setPaymentStatus("PAID");
            order.setRazorpayPaymentId(payment.getString("id"));
            orderRepository.save(order);
            log.info("Marked order {} as PAID", order.getId());
        }
    }

    private void handleFailedPayment(JSONObject eventData) {
        JSONObject payment = eventData.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
        String orderId = payment.getString("order_id");

        Order order = orderRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for Razorpay ID: " + orderId));

        orderRepository.delete(order);
        log.warn("Deleted failed payment order: {}", orderId);
    }
}
