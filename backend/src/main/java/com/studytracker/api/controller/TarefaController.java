package com.studytracker.api.controller;

import com.studytracker.api.domain.StatusTarefa;
import com.studytracker.api.dto.TarefaResponseDTO;
import com.studytracker.api.service.TarefaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tarefas") // Agora as rotas começam com /tarefas
@Tag(name = "Tarefas", description = "Operações diretas em tarefas (status, remoção)")
public class TarefaController {

    private final TarefaService tarefaService;

    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    @PatchMapping("/{id}/status")  // URL Final: PATCH /tarefas/1/status (Não precisa do ID da disciplina.)
    @Operation(summary = "Mudar status", description = "Atualiza status da tarefa para PENDENTE/EM_PROGRESSO/CONCLUIDA")
    public ResponseEntity<TarefaResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody StatusTarefa novoStatus) {
        
        var tarefa = tarefaService.atualizarStatus(id, novoStatus);
        return ResponseEntity.ok(tarefa);
    }

    @DeleteMapping("/{id}")  // URL Final: DELETE /tarefas/1
    @Operation(summary = "Deletar tarefa", description = "Remove a tarefa do sistema")
    public ResponseEntity<Void> removerTarefa(@PathVariable Long id) {
        tarefaService.deletarTarefa(id);
        return ResponseEntity.noContent().build();
    }
}