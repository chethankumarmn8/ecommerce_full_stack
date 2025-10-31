package com.auth.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String category;
    private double price;
    private List<MultipartFile> images;
    private Integer stock;
    private String materials;
    private Double ethicalScore;
}