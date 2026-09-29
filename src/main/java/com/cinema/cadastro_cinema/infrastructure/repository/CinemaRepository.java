package com.cinema.cadastro_cinema.infrastructure.repository;

import com.cinema.cadastro_cinema.infrastructure.entitys.Cinema;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CinemaRepository extends JpaRepository<Cinema, Integer> {

    Optional<Cinema> findByNome(String nome);

    @Transactional
    void deleteByNome(String nome);

}
