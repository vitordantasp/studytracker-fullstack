package com.studytracker.api.dto;

//import jakarta.validation.constraints.NotBlank; // Vamos usar isso depois para validar

// Record: O Java cria construtor, getters, toString e equals sozinho!
public record DisciplinaRequestDTO(
    String nome,
    String professor
) {
}