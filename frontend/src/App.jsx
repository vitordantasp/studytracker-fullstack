import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [disciplinas, setDisciplinas] = useState([])
  const [loading, setLoading] = useState(true)
  
  
  // NAVEGAÇÃO
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null)
  
  // INPUTS
  const [novoNome, setNovoNome] = useState("")
  const [novoProfessor, setNovoProfessor] = useState("")
  const [novaTarefaTitulo, setNovaTarefaTitulo] = useState("")
  const [novaTarefaPrazo, setNovaTarefaPrazo] = useState("")

  // URL DA API
  const BASE_URL = "https://studytracker-api.onrender.com" 

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const response = await fetch(`${BASE_URL}/disciplinas`)
      if (response.ok) {
        const data = await response.json()
        setDisciplinas(data)
        
        // Se estiver com uma disciplina aberta, atualiza ela também em tempo real
        if (disciplinaSelecionada) {
            const atualizada = data.find(d => d.id === disciplinaSelecionada.id)
            if (atualizada) setDisciplinaSelecionada(atualizada)
        }
      }
    } catch (error) {
      console.error("Erro ao buscar:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- AÇÕES DE DISCIPLINA ---

  function abrirDisciplina(disciplina) {
    setDisciplinaSelecionada(disciplina)
  }

  function fecharDisciplina() {
    setDisciplinaSelecionada(null)
  }

  async function handleNovaDisciplina(e) {
    e.preventDefault()
    if (!novoNome || !novoProfessor) return alert("Preencha tudo!")

    const nova = { nome: novoNome, professor: novoProfessor }

    try {
      const response = await fetch(`${BASE_URL}/disciplinas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nova),
      })
      if (response.ok) {
        setNovoNome(""); setNovoProfessor("");
        carregarDados() 
      }
    } catch (error) { console.error(error) }
  }

  // NOVO: Função para deletar disciplina
  async function handleDeletarDisciplina(id, event) {
    event.stopPropagation() // IMPEDE que o clique abra a disciplina
    
    if (!confirm("Tem certeza que deseja excluir esta disciplina e todas as suas tarefas?")) return

    try {
      const response = await fetch(`${BASE_URL}/disciplinas/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        carregarDados() // Atualiza a lista removendo o item
      } else {
        alert("Erro ao deletar disciplina")
      }
    } catch (error) { console.error(error) }
  }

  // --- AÇÕES DE TAREFA ---

async function handleNovaTarefa(e) {
    e.preventDefault()
    if (!novaTarefaTitulo) return

    // O Java espera: { "titulo": "...", "prazo": "YYYY-MM-DD" }
    const payload = { 
        titulo: novaTarefaTitulo,
        prazo: novaTarefaPrazo // <--- Enviando a data aqui!
    } 

    try {
      const response = await fetch(`${BASE_URL}/disciplinas/${disciplinaSelecionada.id}/tarefas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setNovaTarefaTitulo("")
        setNovaTarefaPrazo("") // <--- Limpa o campo de data depois de salvar
        carregarDados() 
      }
    } catch (error) { console.error(error) }
  }

  // NOVO: Alterar status via Select
  async function handleChangeStatus(tarefaId, novoStatus) {
    try {
      const response = await fetch(`${BASE_URL}/tarefas/${tarefaId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoStatus) // Envia a string exata: "EM_PROGRESSO"
      })

      if (response.ok) {
        carregarDados()
      }
    } catch (error) { console.error(error) }
  }

  async function handleDeletarTarefa(id) {
    if(!confirm("Excluir tarefa?")) return
    try {
        await fetch(`${BASE_URL}/tarefas/${id}`, { method: 'DELETE' })
        carregarDados()
    } catch(error) { console.error(error) }
  }

  return (
    <div className="container">
      <h1>StudyTracker 📚</h1>

      {!disciplinaSelecionada && (
        <>
          <div className="card add-card">
            <h2>Nova Disciplina</h2>
            <form onSubmit={handleNovaDisciplina}>
              <div className="form-group">
                <input placeholder="Matéria" value={novoNome} onChange={e => setNovoNome(e.target.value)} />
              </div>
              <div className="form-group">
                <input placeholder="Professor" value={novoProfessor} onChange={e => setNovoProfessor(e.target.value)} />
              </div>
              <button type="submit">Salvar</button>
            </form>
          </div>

          <hr />

          {loading ? <p>Carregando...</p> : (
            <div className="card-grid">
              {disciplinas.map(disc => (
                // O onClick aqui abre a disciplina
                <div key={disc.id} className="card" onClick={() => abrirDisciplina(disc)}>
                  <div className="card-header">
                    <h3>{disc.nome}</h3>
                    {/* Botão de Lixeira (com stopPropagation) */}
                    <button 
                        className="btn-delete-icon" 
                        onClick={(e) => handleDeletarDisciplina(disc.id, e)}
                        title="Excluir Disciplina"
                    >
                        🗑️
                    </button>
                  </div>
                  
                  <p>👨‍🏫 {disc.professor}</p>
                  <small>{disc.tarefas ? disc.tarefas.length : 0} tarefas</small>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {disciplinaSelecionada && (
        <div className="tarefas-container">
          <button className="btn-back" onClick={fecharDisciplina}>⬅ Voltar</button>

          <div className="header-disciplina">
            <h2>{disciplinaSelecionada.nome}</h2>
            <p>Professor: {disciplinaSelecionada.professor}</p>
          </div>

          <div className="card add-card">
            <form onSubmit={handleNovaTarefa}>
              <div className="form-group">
                <input 
                  placeholder="Nova tarefa..." 
                  value={novaTarefaTitulo} 
                  onChange={e => setNovaTarefaTitulo(e.target.value)} 
                  autoFocus
                />
              </div>
              <div className="form-group" style={{maxWidth: '180px'}}>
                <input 
                  type="date" 
                  value={novaTarefaPrazo}
                  onChange={e => setNovaTarefaPrazo(e.target.value)}
                  // Dica: 'required' obriga a escolher uma data, se quiser pode tirar
                  required 
                />
              </div>
              {/* ------------------------ */}
              <button type="submit">Adicionar</button>
            </form>
          </div>

          <div className="lista-tarefas">
            {(!disciplinaSelecionada.tarefas || disciplinaSelecionada.tarefas.length === 0) && (
                <p>Nenhuma tarefa cadastrada.</p>
            )}
            
            {disciplinaSelecionada.tarefas && disciplinaSelecionada.tarefas.map(tarefa => (
              <div key={tarefa.id} className={`tarefa-item status-${tarefa.status.toLowerCase()}`}>
                
                {/* Título da Tarefa */}
                <div style={{flexGrow: 1}}>
                    <div className="tarefa-titulo">{tarefa.titulo}</div>
                    
                    {/* Só mostra se tiver prazo */}
                    {tarefa.prazo && (
                        <small className="tarefa-prazo">
                          📅 {new Date(tarefa.prazo).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                        </small>
                    )}
                </div>

                {/* NOVO: Seletor de Status */}
                <select 
                    value={tarefa.status} 
                    onChange={(e) => handleChangeStatus(tarefa.id, e.target.value)}
                    className="status-select"
                >
                    <option value="PENDENTE">Pendente</option>
                    <option value="EM_PROGRESSO">Em Progresso</option>
                    <option value="CONCLUIDA">Concluída</option>
                </select>
                
                {/* Botão Deletar Tarefa */}
                <button 
                    onClick={() => handleDeletarTarefa(tarefa.id)}
                    className="btn-delete-task"
                >
                    🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App