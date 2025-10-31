package com.auth.controller;

import com.auth.dto.ArtisanRegisterRequest;
import com.auth.dto.ArtisanUpdateRequest;
import com.auth.dto.AuthenticationResponse;
import com.auth.dto.LoginRequest;
import com.auth.model.Artisan;
import com.auth.repository.ArtisanRepository;
import com.auth.service.ArtisanService;
import com.auth.service.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;

@RestController
@RequestMapping("/api/artisan/auth")
@RequiredArgsConstructor
public class ArtisanController {

    private final ArtisanService artisanService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final ArtisanRepository artisanRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerArtisan(
            @ModelAttribute ArtisanRegisterRequest request,
            @RequestParam("certificate") MultipartFile certificate
    ) {
        try {
            Artisan artisan = artisanService.createArtisan(request, certificate);
            String token = jwtUtil.generateToken(artisan.getEmail(), artisan.getId(), "ROLE_ARTISAN");
            return ResponseEntity.ok(new AuthenticationResponse(token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Collections.singletonMap("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginArtisan(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Get user details from authentication
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Fetch artisan using the authenticated email
            Artisan artisan = artisanRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("Artisan not found"));

            String token = jwtUtil.generateToken(artisan.getEmail(), artisan.getId(), "ROLE_ARTISAN");
            return ResponseEntity.ok(new AuthenticationResponse(token));

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    // Backend Additions to ArtisanController.java
    @GetMapping("/profile")
    public ResponseEntity<Artisan> getArtisanProfile(Authentication authentication) {
        String email = authentication.getName();
        Artisan artisan = artisanRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Artisan not found"));
        return ResponseEntity.ok(artisan);
    }

    @PutMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateArtisanProfile(
            @ModelAttribute ArtisanUpdateRequest request,
            @RequestParam(value = "certificate", required = false) MultipartFile certificate,
            Authentication authentication) {

        try {
            Artisan artisan = artisanRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new UsernameNotFoundException("Artisan not found"));

            Artisan updatedArtisan = artisanService.updateArtisan(artisan.getId(), request, certificate);
            return ResponseEntity.ok(updatedArtisan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Collections.singletonMap("message", "Update failed: " + e.getMessage()));
        }
    }

}
