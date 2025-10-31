// CartItemDTO.java
package com.auth.dto;

import com.auth.model.CartItem;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemDTO {
    private Long id;
    private ProductDTO product;
    private int quantity;

    public CartItemDTO(CartItem item) {
        this.id = item.getId();
        this.product = new ProductDTO(item.getProduct());
        this.quantity = item.getQuantity();
    }
}