package com.auth.service;

import com.auth.model.Cart;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CachedCartService {
    private final CartService cartService;

    @Cacheable(value = "userCart", key = "#userEmail")
    public Cart getOrCreateCart(String userEmail) {
        return cartService.getOrCreateCart(userEmail);
    }

    @Caching(
            evict = {
                    @CacheEvict(value = "userCart", key = "#userEmail"),
                    @CacheEvict(value = "cartItems", key = "#itemId")
            }
    )
    public Cart updateCartItem(String userEmail, Long itemId, int quantity) {
        return cartService.updateCartItem(userEmail, itemId, quantity);
    }

    @CacheEvict(value = "userCart", key = "#userEmail")
    public Cart addToCart(String userEmail, Long productId, int quantity) {
        return cartService.addToCart(userEmail, productId, quantity);
    }

    @CacheEvict(value = "userCart", key = "#userEmail")
    public Cart removeFromCart(String userEmail, Long itemId) {
        return cartService.removeFromCart(userEmail, itemId);
    }

    @Cacheable(value = "userCart", key = "#userEmail")
    public Cart getCart(String userEmail) {
        return cartService.getCart(userEmail);
    }
    @CacheEvict(value = "userCart", key = "#userEmail")
    public void clearCart(String userEmail) {
        cartService.clearCart(userEmail);
    }
}