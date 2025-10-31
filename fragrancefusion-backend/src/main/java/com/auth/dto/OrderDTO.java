package com.auth.dto;

import com.auth.model.Order;
import lombok.Getter;
import lombok.Setter;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter
public class OrderDTO {
    private Long id;
    private String deliveryAddress;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;
    private Double totalAmount;
    private String paymentStatus;
    private String orderDate;

    private List<OrderItemDTO> items;

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.deliveryAddress = order.getDeliveryAddress();
        this.city = order.getCity();
        this.state = order.getState();
        this.zipCode = order.getZipCode();
        this.phoneNumber = order.getPhoneNumber();
        this.totalAmount = order.getTotalAmount();
        this.paymentStatus = order.getPaymentStatus();
        this.orderDate = order.getOrderDate().format(DateTimeFormatter.ISO_DATE_TIME);
        this.items = order.getItems().stream()
                .map(OrderItemDTO::new)
                .collect(Collectors.toList());

    }
}