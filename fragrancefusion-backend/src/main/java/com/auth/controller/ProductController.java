package com.auth.controller;

import com.auth.dto.ProductDTO;
import com.auth.dto.ProductRequest;
import com.auth.dto.ReviewDTO;
import com.auth.model.Artisan;
import com.auth.model.Product;
import com.auth.model.ProductImage;
import com.auth.repository.ArtisanRepository;
import com.auth.repository.ProductImageRepository;
import com.auth.repository.ProductRepository;
import com.auth.service.ProductServiceImpl;
import com.auth.service.ReviewServiceImpl;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    private final ProductServiceImpl productServiceImpl;
    private final ArtisanRepository artisanRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewServiceImpl reviewService;

    public ProductController(ProductServiceImpl productServiceImpl,
                             ArtisanRepository artisanRepository,
                             ProductRepository productRepository,
                             ProductImageRepository productImageRepository,
                             ReviewServiceImpl reviewService) {
        this.productServiceImpl = productServiceImpl;
        this.artisanRepository = artisanRepository;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.reviewService = reviewService;
    }

    @GetMapping("/images/{imageId}")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long imageId) {
        // Validate that imageId is positive
        if (imageId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Retrieve the image or throw 404 if not found
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found"));

        // Return the image data with proper content type
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getImageType()))
                .body(image.getImageData());
    }


    @PostMapping("/add")
    public ResponseEntity<ProductDTO> addProduct(
            @ModelAttribute ProductRequest request,
            Authentication authentication) throws IOException {
        log.debug("Adding new product for authenticated user");
        Artisan artisan = getAuthenticatedArtisan(authentication);
        Product product = new Product();
        copyRequestToProduct(request, product);
        product.setArtisan(artisan);
        Product savedProduct = productServiceImpl.addProduct(product, request.getImages());
        log.info("Product added successfully with ID: {}", savedProduct.getId());
        return ResponseEntity.ok(new ProductDTO(savedProduct));
    }

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(
            @PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<ProductDTO>> getArtisanProducts(Authentication authentication) {
        Artisan artisan = getAuthenticatedArtisan(authentication);
        log.debug("Fetching products for artisan ID: {}", artisan.getId());

        List<Product> products = productRepository.findByArtisanId(artisan.getId());
        return ResponseEntity.ok(products.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList()));
    }

    @Transactional
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long productId) {
        Product product = productRepository.findByIdWithImages(productId)
                .orElseThrow(() -> {
                    log.error("Product not found with ID: {}", productId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
                });
        return ResponseEntity.ok(new ProductDTO(product));
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long productId,
            @ModelAttribute ProductRequest request,
            Authentication authentication) throws IOException {
        log.debug("Updating product with ID: {}", productId);
        Product existingProduct = getProductIfOwned(productId, authentication);
        copyRequestToProduct(request, existingProduct);

        Product updatedProduct = productServiceImpl.updateProduct(
                productId,
                existingProduct,
                request.getImages()
        );
        return ResponseEntity.ok(new ProductDTO(updatedProduct));
    }

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long productId,
            Authentication authentication) {
        log.debug("Deleting product with ID: {}", productId);
        Product product = getProductIfOwned(productId, authentication);
        productServiceImpl.deleteProduct(product.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<Product> products = productRepository.findAllWithArtisanAndImages();
        return ResponseEntity.ok(products.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList()));
    }

    private Product getProductIfOwned(Long productId, Authentication authentication) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Artisan artisan = getAuthenticatedArtisan(authentication);
        if (!product.getArtisan().getId().equals(artisan.getId())) {
            log.warn("Unauthorized access attempt for product ID: {} by artisan ID: {}", productId, artisan.getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return product;
    }

    private void copyRequestToProduct(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setMaterials(request.getMaterials());
        product.setEthicalScore(request.getEthicalScore());
    }

    private Artisan getAuthenticatedArtisan(Authentication authentication) {
        return artisanRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Artisan not found"));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getReason());
        return new ResponseEntity<>(errorResponse, ex.getStatusCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Internal server error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}