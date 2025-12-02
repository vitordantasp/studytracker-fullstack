package com.studytracker.api.dto;

import java.time.LocalDateTime;

// Record é perfeito para isso: dados imutáveis de resposta
public record ErroRespostaDTO(
    String status,    // Ex: "404 NOT_FOUND"
    String mensagem,  // Ex: "Disciplina não encontrada com ID 99"
    LocalDateTime dataHora // Ex: 2025-11-20T10:00:00
) {
}