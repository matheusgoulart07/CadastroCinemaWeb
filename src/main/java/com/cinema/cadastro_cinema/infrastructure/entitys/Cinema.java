package com.cinema.cadastro_cinema.infrastructure.entitys;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "cinema")
@Entity

public class Cinema {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "nome", unique = true)
    private String nome;

    @Column(name = "genero")
    private String genero;

    @Column(name = "anoLancamento")
    private Integer anoLancamento;

    @Column(name = "bilheteria")
    private Double bilheteria;

    @Column(name = "nota")
    private Double nota;


}
