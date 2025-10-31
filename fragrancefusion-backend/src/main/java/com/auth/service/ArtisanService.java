package com.auth.service;

import com.auth.dto.ArtisanRegisterRequest;
import com.auth.dto.ArtisanUpdateRequest;
import com.auth.model.Artisan;
import com.auth.repository.ArtisanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ArtisanService {

    private final ArtisanRepository artisanRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public Artisan createArtisan(ArtisanRegisterRequest request, MultipartFile certificate) {

        if (artisanRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        try {
            // Store the uploaded certificate and get the path
            String certificatePath = fileStorageService.storeFile(certificate);

            // Create and save the artisan object
            Artisan artisan = Artisan.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword())) // Encode password
                    .role("ROLE_ARTISAN") // Add proper Spring Security role prefix
                    .name(request.getName())
                    .category(request.getCategory())
                    .experience(request.getExperience())
                    .mobile(request.getMobile())
                    .location(request.getLocation())
                    .materialsUsed(request.getMaterialsUsed())
                    .certificatePath(certificatePath)
                    .build();

            return artisanRepository.save(artisan);

        } catch (IOException e) {
            throw new RuntimeException("File storage failed: " + e.getMessage(), e);
        }
    }
    public Artisan updateArtisan(Long artisanId, ArtisanUpdateRequest request, MultipartFile certificate)
            throws IOException {
        Artisan artisan = artisanRepository.findById(artisanId)
                .orElseThrow(() -> new RuntimeException("Artisan not found"));

        if (request.getEmail() != null && !request.getEmail().equals(artisan.getEmail())) {
            if (artisanRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already registered");
            }
            artisan.setEmail(request.getEmail());
        }

        if (request.getName() != null)
            artisan.setName(request.getName());
        if (request.getCategory() != null)
            artisan.setCategory(request.getCategory());
        if (request.getExperience() != null)
            artisan.setExperience(request.getExperience());
        if (request.getMobile() != null)
            artisan.setMobile(request.getMobile());
        if (request.getLocation() != null)
            artisan.setLocation(request.getLocation());
        if (request.getMaterialsUsed() != null)
            artisan.setMaterialsUsed(request.getMaterialsUsed());

        if (certificate != null && !certificate.isEmpty()) {
            String certificatePath = fileStorageService.storeFile(certificate);
            artisan.setCertificatePath(certificatePath);
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new RuntimeException("Passwords do not match");
            }
            artisan.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return artisanRepository.save(artisan);
    }
}
