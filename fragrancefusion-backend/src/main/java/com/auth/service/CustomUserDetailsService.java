package com.auth.service;

import com.auth.model.Admin;
import com.auth.model.Artisan;
import com.auth.model.User;
import com.auth.repository.AdminRepository;
import com.auth.repository.ArtisanRepository;
import com.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ArtisanRepository artisanRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check Admin first
        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null) {
            return buildAdminDetails(admin);
        }

        // Then check Artisan
        Artisan artisan = artisanRepository.findByEmail(email).orElse(null);
        if (artisan != null) {
            return buildArtisanDetails(artisan);
        }

        // Finally fallback to general User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return buildUserDetails(user);
    }

    private UserDetails buildAdminDetails(Admin admin) {
        return org.springframework.security.core.userdetails.User
                .withUsername(admin.getEmail())
                .password(admin.getPassword())
                .authorities("ROLE_ADMIN")
                .build();
    }

    private UserDetails buildArtisanDetails(Artisan artisan) {
        return org.springframework.security.core.userdetails.User
                .withUsername(artisan.getEmail())
                .password(artisan.getPassword())
                .authorities("ROLE_ARTISAN")
                .build();
    }

    private UserDetails buildUserDetails(User user) {
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole())
                .build();
    }
}