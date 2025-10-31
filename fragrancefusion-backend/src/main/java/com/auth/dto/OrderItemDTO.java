package com.auth.dto;

import com.auth.model.OrderItem;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemDTO {
    private Long id;
    private int quantity;
    private Double price;
    private ProductDTO product;

    public OrderItemDTO(OrderItem item) {
        this.id = item.getId();
        this.quantity = item.getQuantity();
        this.price = item.getPrice();
        this.product = new ProductDTO(item.getProduct());
    }
}