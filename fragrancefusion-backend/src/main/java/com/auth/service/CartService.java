package com.auth.service;

import com.auth.model.Cart;
import com.auth.model.CartItem;
import com.auth.model.Product;
import com.auth.model.User;
import com.auth.repository.CartRepository;
import com.auth.repository.ProductRepository;
import com.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Cart getOrCreateCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return cartRepository.findByUserIdWithItemsAndProducts(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    public Cart addToCart(String userEmail, Long productId, int quantity) {
        Cart cart = getOrCreateCart(userEmail);
        Product product = productRepository.findByIdWithImages(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // New stock validation checks
        if (product.getStock() <= 0) {
            throw new RuntimeException("Product is out of stock");
        }
        if (quantity > product.getStock()) {
            throw new RuntimeException("Requested quantity exceeds available stock");
        }

        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + quantity),
                        () -> {
                            CartItem newItem = new CartItem();
                            newItem.setProduct(product);
                            newItem.setQuantity(quantity);
                            newItem.setCart(cart);
                            cart.getItems().add(newItem);
                        }
                );

        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String userEmail, Long itemId) {
        Cart cart = getOrCreateCart(userEmail);
        boolean removed = cart.getItems().removeIf(item -> item.getId().equals(itemId));
        return removed ? cartRepository.save(cart) : cart;
    }

    @Transactional
    public Cart getCart(String userEmail) {
        return getOrCreateCart(userEmail);
    }

    public Cart updateCartItem(String userEmail, Long itemId, int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        Cart cart = cartRepository.findByUserEmailAndItemId(userEmail, itemId)
                .orElseThrow(() -> new RuntimeException("Cart or item not found"));

        cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    // Add stock check when updating quantity
                    Product product = item.getProduct();
                    if (quantity > product.getStock()) {
                        throw new RuntimeException("Requested quantity exceeds available stock");
                    }
                    item.setQuantity(quantity);
                });

        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        cartRepository.findByUserIdWithItems(user.getId())
                .ifPresent(cart -> {
                    cart.getItems().clear();
                    cartRepository.save(cart);
                });
    }
}