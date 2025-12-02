package com.studytracker.api.dto;

import com.studytracker.api.domain.Tarefa;
import java.time.LocalDate;

public record TarefaResponseDTO(
    Long id,
    String titulo,
    String status, // Podemos devolver como String para facilitar
    LocalDate prazo
) {
    // Construtor auxiliar de conversão
    public TarefaResponseDTO(Tarefa tarefa) {
        this(
            tarefa.getId(), 
            tarefa.getTitulo(), 
            tarefa.getStatus().toString(), 
            tarefa.getPrazo()
        );
    }
}