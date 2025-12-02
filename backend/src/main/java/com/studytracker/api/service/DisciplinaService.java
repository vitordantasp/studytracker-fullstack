package com.studytracker.api.service;

import com.studytracker.api.domain.Disciplina;
import com.studytracker.api.dto.DisciplinaRequestDTO;
import com.studytracker.api.dto.DisciplinaResponseDTO;
import com.studytracker.api.exception.RecursoNaoEncontradoException;
import com.studytracker.api.repository.DisciplinaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// 1. O Crachá de Serviço: Avisa ao Spring que aqui tem Regra de Negócio
@Service
public class DisciplinaService {

    private final DisciplinaRepository repository;

    // Injeção de Dependência do Repository (A "Despensa")
    public DisciplinaService(DisciplinaRepository repository) {
        this.repository = repository;
    }

    public List<DisciplinaResponseDTO> listarTodasDisciplinas() {
        // Busca as entidades no banco e converte para DTO usando Stream
        return repository.findAll().stream()
                .map(DisciplinaResponseDTO::new)
                .toList();
    }

    public DisciplinaResponseDTO adicionarDisciplina(DisciplinaRequestDTO dados) {
        // 1. Converte DTO (Entrada) -> Entity
        Disciplina novaDisciplina = new Disciplina();
        novaDisciplina.setNome(dados.nome());
        novaDisciplina.setProfessor(dados.professor());

        // 2. Salva no Banco
        Disciplina disciplinaSalva = repository.save(novaDisciplina);

        // 3. Converte Entity -> DTO (Saída) e retorna
        return new DisciplinaResponseDTO(disciplinaSalva);
    }

    public void deletarDisciplina(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Disciplina não encontrada!");
        }
        repository.deleteById(id);
    }
}