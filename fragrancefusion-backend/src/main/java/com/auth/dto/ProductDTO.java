package com.auth.dto;

import com.auth.model.Product;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProductDTO {
    private Long id;
    private Integer stock;
    private String name;
    private String description;
    private String category;
    private double price;
    private List<String> imageData;
    private String materials;
    private Double ethicalScore;
    private Long artisanId;
    private String artisanName;
    private String artisanCategory;
    private String artisanLocation;
    private Double averageRating;
    private Long reviewCount;

    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.category = product.getCategory();
        this.price = product.getPrice();
        this.stock = product.getStock();
        this.materials = product.getMaterials();
        this.ethicalScore = product.getEthicalScore();
        this.averageRating = product.getAverageRating();
        this.reviewCount = product.getReviewCount();

        // Enhanced image conversion with null safety and error handling
        this.imageData = product.getImages() != null ?
                product.getImages().stream()
                        .map(img -> {
                            try {
                                return "data:" + img.getImageType() + ";base64," +
                                        Base64.getEncoder().encodeToString(img.getImageData());
                            } catch (Exception e) {
                                return null;
                            }
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList()) :
                new ArrayList<>();

        // Artisan reference handling
        if (product.getArtisan() != null) {
            this.artisanId = product.getArtisan().getId();
            this.artisanName = product.getArtisan().getName();
            this.artisanCategory = product.getArtisan().getCategory();
            this.artisanLocation = product.getArtisan().getLocation();
        }
    }
}