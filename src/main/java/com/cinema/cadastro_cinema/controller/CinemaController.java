package com.cinema.cadastro_cinema.controller;

import com.cinema.cadastro_cinema.infrastructure.entitys.Cinema;
import com.cinema.cadastro_cinema.business.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cinema")
@RequiredArgsConstructor
public class CinemaController {

    private final CinemaService cinemaService;

    @PostMapping
    public ResponseEntity<Void> salvarCinema(@RequestBody Cinema cinema){
        cinemaService.salvarCinema(cinema);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Cinema> buscarCinemaPorNome(@RequestParam String nome){
        return ResponseEntity.ok(cinemaService.buscarCinemaPorNome(nome));
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarCinemaPorNome(@RequestParam String nome){
        cinemaService.deletarCinemaPorNome(nome);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> atualizarCinemaPorId(@RequestBody Cinema cinema, @RequestParam Integer id){
        cinemaService.atualizarCinemaPorId(id, cinema);
        return ResponseEntity.ok().build();
    }

}
