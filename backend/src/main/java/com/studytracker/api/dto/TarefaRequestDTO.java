package com.studytracker.api.dto;

import java.time.LocalDate;

public record TarefaRequestDTO(
    String titulo,
    LocalDate prazo
) {
}