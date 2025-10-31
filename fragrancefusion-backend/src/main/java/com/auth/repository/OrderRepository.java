//package com.auth.repository;
//
//import com.auth.model.Order;
//import com.auth.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface OrderRepository extends JpaRepository<Order, Long> {
//
//    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
//
//    List<Order> findByUserAndRazorpayPaymentIdIsNotNull(User user);
//
//    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = ?1")
//    Optional<Order> findByIdWithItems(Long orderId);
//
//
//
//    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN ?1 AND ?2 AND o.user = ?3")
//    List<Order> findByOrderDateBetweenAndUser(LocalDateTime start, LocalDateTime end, User user);
//
////    // OrderRepository.java - Update query to fetch product images
////    @Query("SELECT o FROM Order o " +
////            "LEFT JOIN FETCH o.items i " +
////            "LEFT JOIN FETCH i.product p " +
////            "LEFT JOIN FETCH p.images " +
////            "WHERE o.user = :user AND o.razorpayPaymentId IS NOT NULL")
////    List<Order> findByUserAndRazorpayPaymentIdIsNotNull(@Param("user") User user);
//
//
//
//    @Query("SELECT DISTINCT o FROM Order o " +
//            "LEFT JOIN FETCH o.items i " +
//            "LEFT JOIN FETCH i.product p " +
//            "LEFT JOIN FETCH o.user u " +
//            "WHERE p.artisan.id = :artisanId " +
//            "AND o.razorpayPaymentId IS NOT NULL")
//    List<Order> findByItemsProductArtisanId(@Param("artisanId") Long artisanId);
//
//    // OrderRepository.java - Add this method
//    @Query("SELECT o FROM Order o " +
//            "LEFT JOIN FETCH o.items i " +
//            "LEFT JOIN FETCH i.product p " +
//            "LEFT JOIN FETCH p.images " +
//            "WHERE o.id = ?1")
//    Optional<Order> findByIdWithItemsAndProductImages(Long orderId);
//
//    @Query("SELECT DISTINCT o FROM Order o " +
//            "LEFT JOIN FETCH o.items i " +
//            "LEFT JOIN FETCH i.product " +
//            "WHERE o.user.id = :userId")
//    List<Order> findByUserIdWithOrderItems(@Param("userId") Long userId);
//
//    @Query("SELECT SUM(o.totalAmount) FROM Order o " +
//            "JOIN o.items i " +
//            "WHERE i.product.artisan.id = :artisanId " +
//            "AND o.razorpayPaymentId IS NOT NULL")
//    Double findTotalSalesByArtisan(@Param("artisanId") Long artisanId);
//
//    @Query("SELECT FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m') AS month, " +
//            "SUM(o.totalAmount) AS total " +
//            "FROM Order o " +
//            "JOIN o.items i " +
//            "WHERE i.product.artisan.id = :artisanId " +
//            "AND o.razorpayPaymentId IS NOT NULL " +
//            "GROUP BY FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m') " +
//            "ORDER BY month ASC")
//    List<Object[]> findMonthlyRevenueByArtisan(@Param("artisanId") Long artisanId);
//
//    @Query("SELECT i.product.name AS productName, SUM(i.quantity) AS totalSold " +
//            "FROM Order o " +
//            "JOIN o.items i " +
//            "WHERE i.product.artisan.id = :artisanId " +
//            "AND o.razorpayPaymentId IS NOT NULL " +
//            "GROUP BY i.product.name " +
//            "ORDER BY totalSold DESC " +
//            "LIMIT 5")
//    List<Object[]> findTopProductsByArtisan(@Param("artisanId") Long artisanId);
//
//
//
//
//
//}
package com.auth.repository;

import com.auth.model.Order;
import com.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    List<Order> findByUserAndRazorpayPaymentIdIsNotNull(User user);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = ?1")
    Optional<Order> findByIdWithItems(Long orderId);

    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN ?1 AND ?2 AND o.user = ?3")
    List<Order> findByOrderDateBetweenAndUser(LocalDateTime start, LocalDateTime end, User user);

    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.items i " +
            "LEFT JOIN FETCH i.product p " +
            "LEFT JOIN FETCH o.user u " +
            "WHERE p.artisan.id = :artisanId " +
            "AND o.razorpayPaymentId IS NOT NULL")
    List<Order> findByItemsProductArtisanId(@Param("artisanId") Long artisanId);

    @Query("SELECT o FROM Order o " +
            "LEFT JOIN FETCH o.items i " +
            "LEFT JOIN FETCH i.product p " +
            "LEFT JOIN FETCH p.images " +
            "WHERE o.id = ?1")
    Optional<Order> findByIdWithItemsAndProductImages(Long orderId);

//    @Query("SELECT COUNT(o) FROM Order o " +
//            "JOIN o.items i " +
//            "WHERE i.product.artisan.id = :artisanId")
//    Long countByArtisan(@Param("artisanId") Long artisanId);

    @Query("SELECT SUM(i.quantity) FROM Order o " +
            "JOIN o.items i " +
            "WHERE i.product.artisan.id = :artisanId " +
            "AND o.razorpayPaymentId IS NOT NULL")
    Long sumTotalItemsSoldByArtisan(@Param("artisanId") Long artisanId);

    @Query("SELECT COUNT(DISTINCT o.user) FROM Order o " +
            "JOIN o.items i " +
            "WHERE i.product.artisan.id = :artisanId")
    Long countUniqueCustomersByArtisan(@Param("artisanId") Long artisanId);

    @Query("SELECT o FROM Order o " +
            "JOIN o.items i " +
            "WHERE i.product.artisan.id = :artisanId " +
            "ORDER BY o.orderDate DESC LIMIT 5")
    List<Order> findTop5ByArtisanIdOrderByOrderDateDesc(@Param("artisanId") Long artisanId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o " +
            "JOIN o.items i " +
            "WHERE i.product.artisan.id = :artisanId " +
            "AND o.razorpayPaymentId IS NOT NULL")
    Double findTotalSalesByArtisan(@Param("artisanId") Long artisanId);

    @Query("SELECT FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m') AS month, " +
            "SUM(o.totalAmount) AS total " +
            "FROM Order o " +
            "JOIN o.items i " +
            "WHERE i.product.artisan.id = :artisanId " +
            "AND o.razorpayPaymentId IS NOT NULL " +
            "GROUP BY FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m') " +
            "ORDER BY FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m') ASC")
    List<Object[]> findMonthlyRevenueByArtisan(@Param("artisanId") Long artisanId);

    @Query("SELECT i.product.name AS productName, SUM(i.quantity) AS totalSold " +
            "FROM Order o " +
            "JOIN o.items i " +
            "WHERE i.product.artisan.id = :artisanId " +
            "AND o.razorpayPaymentId IS NOT NULL " +
            "GROUP BY i.product.name " +
            "ORDER BY totalSold DESC " +
            "LIMIT 5")
    List<Object[]> findTopProductsByArtisan(@Param("artisanId") Long artisanId);

    @Query("SELECT COUNT(o) FROM Order o JOIN o.items i WHERE i.product.artisan.id = :artisanId")
    Long countByArtisan(@Param("artisanId") Long artisanId);
}