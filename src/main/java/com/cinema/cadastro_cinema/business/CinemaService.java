package com.cinema.cadastro_cinema.business;

import com.cinema.cadastro_cinema.infrastructure.entitys.Cinema;
import com.cinema.cadastro_cinema.infrastructure.repository.CinemaRepository;
import org.springframework.stereotype.Service;


@Service

public class CinemaService {

    private final CinemaRepository repository;

    private CinemaService(CinemaRepository repository) {
        this.repository = repository;
    }

    public void salvarCinema(Cinema cinema){
        repository.saveAndFlush(cinema);
    }

    public Cinema buscarCinemaPorNome(String nome){

        return repository.findByNome(nome).orElseThrow(
                () -> new RuntimeException("Nome não encontrado")
        );
    }

    public void deletarCinemaPorNome(String nome){
        repository.deleteByNome(nome);
    }

    public void atualizarCinemaPorNome(String nome, Cinema cinema){
        Cinema cinemaEntity = buscarCinemaPorNome(nome);
        Cinema cinemaAtualizado = Cinema.builder()
                .nome(nome)
                .nome(cinema.getNome() != null ? cinema.getNome() : cinemaEntity.getNome())
                .id(usuarioEntity.getId())
                .build();
    }
}
