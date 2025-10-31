package com.auth.config;

import com.auth.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.disable())
                )
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        // In WebSecurityConfig.java, update public endpoints:
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/artisan/auth/**",
                                "/api/products/**",
                                "/razorpay/webhook",
                                "/proxy/aitopia", // Add missing slash
                                "/api/admin/auth/**",
                                "/api/products/images/**"
                        ).permitAll()

                        // Authenticated endpoints (any logged-in user)
                        .requestMatchers(
                                "/api/user/profile",
                                "/api/orders/my-orders",
                                "/api/orders/**",
                                "/api/auth/change-password"
                        ).authenticated()

                        // Artisan-specific endpoints
                        .requestMatchers(HttpMethod.POST, "/api/artisan/products/add").hasRole("ARTISAN")
                        .requestMatchers(HttpMethod.GET, "/api/products/my-products/**").hasRole("ARTISAN")
                        .requestMatchers("/api/artisan/**").hasRole("ARTISAN")
                        // WebSecurityConfig.java
                        .requestMatchers(HttpMethod.GET, "/api/orders/artisan/**").hasRole("ARTISAN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // WebSecurityConfig.java
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/artisan/*/orders",
                                "/api/orders/artisan/*/orders/*"
                        ).hasRole("ARTISAN")


                        // User role-specific endpoints
                        .requestMatchers("/api/auth/change-password").hasRole("USER")
                        .requestMatchers("/api/cart/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/checkout/**").hasRole("USER")

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allowed origins
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://your-production-domain.com"
        ));
        // Specific HTTP methods instead of wildcard
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // Required headers for authentication and Razorpay
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "X-Razorpay-Signature"
        ));
        // Exposed headers
        configuration.setExposedHeaders(List.of(
                "Authorization",
                "Content-Disposition"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        provider.setHideUserNotFoundExceptions(false);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}