package com.studytracker.api.controller;

import com.studytracker.api.service.DisciplinaService;
import com.studytracker.api.service.TarefaService;
import com.studytracker.api.dto.DisciplinaRequestDTO;
import com.studytracker.api.dto.DisciplinaResponseDTO;
import com.studytracker.api.dto.TarefaRequestDTO;
import com.studytracker.api.dto.TarefaResponseDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController // 1. O "Crachá" de Garçom: Avisa ao Spring que essa classe controla rotas web
@RequestMapping("/disciplinas") // 2. A "Mesa" que ele atende: Qualquer URL que comece com /disciplinas vem pra cá
@Tag(name = "Disciplinas", description = "Gerenciamento das disciplinas e suas tarefas") 
public class DisciplinaController {

    private final DisciplinaService disciplinaService;     
    private final TarefaService tarefaService; // Precisa do TarefaService para criar tarefas

    public DisciplinaController(DisciplinaService disciplinaService, TarefaService tarefaService) {
        this.disciplinaService = disciplinaService;
        this.tarefaService = tarefaService;
    }

    @GetMapping
    @Operation(summary = "Listar todas as disciplinas", description = "Retorna a lista de todas as disciplinas cadastradas com suas tarefas")
    public ResponseEntity<List<DisciplinaResponseDTO>> listarTodas() {
        List<DisciplinaResponseDTO> lista = disciplinaService.listarTodasDisciplinas();
        return ResponseEntity.ok(lista);
    }

   @PostMapping
   @Operation(summary = "Adicionar disciplina", description = "Cria uma nova disciplina no sistema")
   @ApiResponse(responseCode = "201", description = "Disciplina criada com sucesso")  
   public ResponseEntity<DisciplinaResponseDTO> criarDisciplina(@RequestBody DisciplinaRequestDTO dados) {
        DisciplinaResponseDTO novaDisciplina = disciplinaService.adicionarDisciplina(dados);
        return ResponseEntity.status(201).body(novaDisciplina); // 201 Created é mais bonito que 200 OK para criação
    }
    
    @PostMapping("/{id}/tarefas")
    @Operation(summary = "Adicionar tarefa ", description = "Cria uma nova tarefa referente a uma disciplina")
    public ResponseEntity<TarefaResponseDTO> criarTarefa(@PathVariable Long id, @RequestBody TarefaRequestDTO dados) {
        var tarefa = tarefaService.adicionarTarefa(id, dados);
        return ResponseEntity.status(201).body(tarefa);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar disciplina", description = "Remove a disciplina juntamente de suas tarefas")
    @ApiResponse(responseCode = "204", description = "Disciplina removida com sucesso") 
    @ApiResponse(responseCode = "404", description = "Disciplina não encontrada")
    public ResponseEntity<Void> removerDisciplina(@PathVariable Long id) {
        disciplinaService.deletarDisciplina(id);
        return ResponseEntity.noContent().build();
    }
        
}
