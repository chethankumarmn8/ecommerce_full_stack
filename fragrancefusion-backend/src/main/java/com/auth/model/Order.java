package com.auth.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Explicitly map to the 'id' column
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "order")
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    private String deliveryAddress;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;
    private Double totalAmount;
    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'CREATED'")
    private String paymentStatus;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

    @CreationTimestamp
    private LocalDateTime orderDate;



    public void addOrderItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}