package com.cinema.cadastro_cinema.business;

import com.cinema.cadastro_cinema.infrastructure.entitys.Cinema;
import com.cinema.cadastro_cinema.infrastructure.repository.CinemaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- 1. ADICIONE ESTE IMPORT

@Service
public class CinemaService {

    private final CinemaRepository repository;

    public CinemaService(CinemaRepository repository) {
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

    @Transactional // <-- 2. ADICIONE ESTA ANOTAÇÃO AQUI
    public void deletarCinemaPorNome(String nome){
        repository.deleteByNome(nome);
    }

    public void atualizarCinemaPorId(Integer id, Cinema cinema){
        Cinema cinemaEntity = repository.findById(id).orElseThrow(() ->
                new RuntimeException("Cinema não encontrado"));

        Cinema cinemaAtualizado = Cinema.builder()
                .id(cinemaEntity.getId())
                .nome(cinema.getNome() != null ? cinema.getNome() : cinemaEntity.getNome())
                .genero(cinema.getGenero() != null ? cinema.getGenero() : cinemaEntity.getGenero())
                .anoLancamento(cinema.getAnoLancamento() != null ? cinema.getAnoLancamento() : cinemaEntity.getAnoLancamento())
                .bilheteria(cinema.getBilheteria() != null ? cinema.getBilheteria() : cinemaEntity.getBilheteria())
                .nota(cinema.getNota() != null ? cinema.getNota() : cinemaEntity.getNota())
                .build();

        repository.saveAndFlush(cinemaAtualizado);
    }
}