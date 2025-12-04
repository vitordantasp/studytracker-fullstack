package com.studytracker.api.service;

import com.studytracker.api.domain.Disciplina;
import com.studytracker.api.dto.DisciplinaRequestDTO;
import com.studytracker.api.dto.DisciplinaResponseDTO;
import com.studytracker.api.repository.DisciplinaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*; 
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import com.studytracker.api.exception.RecursoNaoEncontradoException;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

// 1. Avisa ao JUnit para ligar o motor do Mockito
@ExtendWith(MockitoExtension.class)
class DisciplinaServiceTest {

    // 2. @Mock: Cria uma versão falsa do Repositório. 
    // Ele não vai no banco de verdade.
    @Mock
    private DisciplinaRepository repository;

    // 3. @InjectMocks: Cria o Service de verdade, mas INJETA o mock acima dentro dele.
    @InjectMocks
    private DisciplinaService service;

    @Test
    @DisplayName("Deve criar uma disciplina com sucesso")
    void criarDisciplinaSucesso() {
        // --- CENÁRIO (Arrange) ---
        // O dado que vai entrar
        DisciplinaRequestDTO dadosEntrada = new DisciplinaRequestDTO("Matemática", "Prof. X");
        
        // O dado que o "banco falso" deveria retornar
        Disciplina disciplinaSalva = new Disciplina("Matemática", "Prof. X");
        disciplinaSalva.setId(1L); // Simulamos que o banco gerou ID 1

        // A MÁGICA DO MOCKITO:
        // "Quando o repository.save for chamado com QUALQUER disciplina... retorne 'disciplinaSalva'"
        when(repository.save(any(Disciplina.class))).thenReturn(disciplinaSalva);

        // --- AÇÃO (Act) ---
        // Chamamos o método que queremos testar
        DisciplinaResponseDTO resultado = service.adicionarDisciplina(dadosEntrada);

        // --- VALIDAÇÃO (Assert) ---
        // Verificamos se o service devolveu o que esperávamos
        assertNotNull(resultado); // Não pode ser nulo
        assertEquals(1L, resultado.id()); // O ID tem que ser 1
        assertEquals("Matemática", resultado.nome()); // O nome tem que ser igual
        assertEquals("Prof. X", resultado.professor());
    }

    @Test
    @DisplayName("Deve lançar erro ao tentar deletar disciplina inexistente")
    void deletarDisciplinaInexistente() {
        // --- CENÁRIO ---
        Long idInvalido = 99L;
        
        // Ensinamos o Mockito a dizer "Não, não existe" quando perguntarem por esse ID
        when(repository.existsById(idInvalido)).thenReturn(false);

        // --- AÇÃO E VALIDAÇÃO ---
        // Aqui a sintaxe é diferente: "Espere que lance X quando eu executar Y"
        assertThrows(RecursoNaoEncontradoException.class, () -> {
            service.deletarDisciplina(idInvalido);
        });

        // Verificação de Segurança:
        // Garantimos que o método deleteById NUNCA foi chamado.
        // Se o código tivesse tentado deletar mesmo sem achar, isso pegaria o bug.
        verify(repository, never()).deleteById(idInvalido);
    }
}