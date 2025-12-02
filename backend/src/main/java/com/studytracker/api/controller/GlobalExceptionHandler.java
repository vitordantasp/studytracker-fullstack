package com.studytracker.api.controller;

import com.studytracker.api.dto.ErroRespostaDTO;
import com.studytracker.api.exception.RecursoNaoEncontradoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice // 1. O Crachá: "Eu trato erros de todos os Controllers"
public class GlobalExceptionHandler {

    // 2. O Especialista: "Se acontecer RecursoNaoEncontradoException, chame este método"
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroRespostaDTO> tratarNaoEncontrado(RecursoNaoEncontradoException ex) {
        
        // Montamos o DTO de erro bonitinho
        ErroRespostaDTO erro = new ErroRespostaDTO(
                HttpStatus.NOT_FOUND.toString(), // "404 NOT_FOUND"
                ex.getMessage(),                 // A mensagem que passamos no Service
                LocalDateTime.now()              // Hora do erro
        );

        // Retornamos com status 404
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }
    
    // Podemos ter outros métodos aqui para outros tipos de erro (ex: 400 Bad Request)
}