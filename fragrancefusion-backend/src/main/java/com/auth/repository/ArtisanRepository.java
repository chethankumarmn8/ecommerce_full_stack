package com.auth.repository;

import com.auth.model.Artisan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ArtisanRepository extends JpaRepository<Artisan, Long> {
    Optional<Artisan> findByEmail(String email);
    boolean existsByEmail(String email);


}