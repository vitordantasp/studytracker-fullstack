package com.studytracker.api.exception;

// Estendemos RuntimeException para não sermos obrigados a usar try-catch em todo lugar (Unchecked Exception)
public class RecursoNaoEncontradoException extends RuntimeException {
    
    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}