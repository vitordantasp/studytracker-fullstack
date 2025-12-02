package com.studytracker.api.domain;

import jakarta.persistence.*; // Importa TUDO de JPA
import com.fasterxml.jackson.annotation.JsonIgnore; // Importante para não dar loop infinito
import java.time.LocalDate;

@Entity // 1. Diz: "Isso vira uma tabela no banco"
public class Tarefa {

    @Id // 2. Diz: "Essa é a Chave Primária (PK)"
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 3. Diz: "O Postgres gera o ID sozinho (Auto Increment)"
    private Long id;

    private String titulo;
    private LocalDate prazo;

    @Enumerated(EnumType.STRING) // 4. Diz: "Salve o texto do Enum (PENDENTE), não o número"
    private StatusTarefa status;

    // 5. O RELACIONAMENTO (A Chave Estrangeira)
    @ManyToOne // Muitas tarefas para Uma disciplina
    @JoinColumn(name = "disciplina_id") // Nome da coluna no banco
    @JsonIgnore // <--- MUITO IMPORTANTE: Evita loop infinito no JSON (Disciplina chama Tarefa, que chama Disciplina...)
    private Disciplina disciplina;

    public Tarefa() { } // Obrigatório para JPA

    public Tarefa(String titulo, LocalDate prazo) {
        this.titulo = titulo;
        this.prazo = prazo;
        this.status = StatusTarefa.PENDENTE;
    }

    public Long getId() {return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public LocalDate getPrazo() { return prazo; }
    public void setPrazo(LocalDate prazo) { this.prazo = prazo; }
    
    public StatusTarefa getStatus() { return status; }
    public void setStatus(StatusTarefa status) { this.status = status; }

    public Disciplina getDisciplina() { return disciplina; }
    public void setDisciplina(Disciplina disciplina) { this.disciplina = disciplina; }
}