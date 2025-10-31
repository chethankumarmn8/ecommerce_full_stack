package com.auth.service;

import com.auth.model.Product;
import com.auth.model.ProductImage;
import com.auth.repository.ProductImageRepository;
import com.auth.repository.ProductRepository;
import com.auth.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductServiceImpl {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository,
                              ProductImageRepository productImageRepository,
                              ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public Product addProduct(Product product, List<MultipartFile> images) throws IOException {
        Product savedProduct = productRepository.save(product);

        if (images != null && !images.isEmpty()) {
            List<ProductImage> productImages = saveProductImages(savedProduct, images);
            savedProduct.setImages(productImages);
        }

        return productRepository.save(savedProduct);
    }

    public List<Product> getProductsByArtisanId(Long artisanId) {
        return productRepository.findByArtisanId(artisanId);
    }

    @Transactional
    public Product updateProduct(Long productId, Product productDetails, List<MultipartFile> newImages) throws IOException {
        Product managedProduct = productRepository.findByIdWithImages(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found with id: " + productId));

        managedProduct.setName(productDetails.getName());
        managedProduct.setDescription(productDetails.getDescription());
        managedProduct.setPrice(productDetails.getPrice());
        managedProduct.setCategory(productDetails.getCategory());
        managedProduct.setStock(productDetails.getStock());
        managedProduct.setEthicalScore(productDetails.getEthicalScore());
        managedProduct.setMaterials(productDetails.getMaterials());

        if (newImages != null && !newImages.isEmpty()) {
            productImageRepository.deleteAll(managedProduct.getImages());
            managedProduct.getImages().clear();

            List<ProductImage> productImages = saveProductImages(managedProduct, newImages);
            managedProduct.getImages().addAll(productImages);
        }

        return productRepository.save(managedProduct);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findByIdWithImages(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found with id: " + productId));

        productImageRepository.deleteAll(product.getImages());
        productRepository.delete(product);
    }

    private List<ProductImage> saveProductImages(Product product, List<MultipartFile> images) throws IOException {
        List<ProductImage> productImages = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                ProductImage productImage = new ProductImage();
                productImage.setImageData(image.getBytes());
                productImage.setImageType(image.getContentType());
                productImage.setProduct(product);
                productImages.add(productImage);
            }
        }

        return productImageRepository.saveAll(productImages);
    }

    @Transactional(readOnly = true)
    public Product getProductWithImages(Long productId) {
        Product product = productRepository.findByIdWithImages(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        Double avgRating = reviewRepository.findAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.countByProductId(productId);
        product.setReviewStats(avgRating != null ? avgRating : 0.0,
                reviewCount != null ? reviewCount : 0L);

        return product;
    }
}