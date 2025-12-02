package com.studytracker.api.dto;

import com.studytracker.api.domain.Disciplina;
import java.util.List;

public record DisciplinaResponseDTO(
    Long id,
    String nome,
    String professor,
    List<TarefaResponseDTO> tarefas // <--- Agora devolvemos uma lista de DTOs, não de Entities!
) {
    public DisciplinaResponseDTO(Disciplina disciplina) {
        this(
            disciplina.getId(), 
            disciplina.getNome(), 
            disciplina.getProfessor(),
            // Convertemos a lista de Tarefas (Entity) para TarefaResponseDTO
            disciplina.getTarefas() != null ? disciplina.getTarefas().stream().map(TarefaResponseDTO::new).toList() : List.of()
        );
    }
}