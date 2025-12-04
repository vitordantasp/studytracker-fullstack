// A URL da sua API Java (Back-end)
const API_URL = "http://localhost:8080/disciplinas";
let disciplinaSelecionadaId = null; // Vai guardar o ID da disciplina que o usuário clicou

// 1. Função para carregar dados (GET)
async function carregarDisciplinas() {
    try {
        // O 'fetch' é como o Thunder Client do navegador
        const resposta = await fetch(API_URL);
        
        // Convertemos a resposta para JSON
        const disciplinas = await resposta.json();

        // Chamamos a função que desenha na tela
        renderizarLista(disciplinas);
        
    } catch (erro) {
        console.error("Erro ao buscar disciplinas:", erro);
        alert("Erro ao conectar com o servidor!");
    }
}

// 2. Função para desenhar na tela (Manipulação do DOM)
function renderizarLista(disciplinas) {
    const lista = document.getElementById("lista-disciplinas");
    lista.innerHTML = "";

    disciplinas.forEach(disciplina => {
        const item = document.createElement("li");
        
        // Vamos criar um texto + um botão vermelho de excluir
        
        // 1. O texto da disciplina
        const texto = document.createElement("span");
        const qtdTarefas = disciplina.tarefas ? disciplina.tarefas.length : 0;
        texto.textContent = `${disciplina.nome} - ${disciplina.professor} (${qtdTarefas} tarefas) `;
        texto.classList.add("link-disciplina"); // <--- MUDANÇA (Usa o estilo azul/negrito do CSS)
       
        // O CLIQUE:
        // Quando clicar no texto, chama a função mostrarTarefas passando o objeto inteiro
        texto.onclick = () => mostrarTarefas(disciplina);

        // 2. O botão de excluir
        const btnDeletar = document.createElement("button");
        btnDeletar.textContent = "🗑️"; // Ícone de lixeira
        btnDeletar.classList.add("delete-btn"); // (Usa o estilo vermelho do CSS)
        
        // O PULO DO GATO:
        // Quando clicar, chama a função deletar passando o ID desta disciplina específica
        btnDeletar.onclick = () => deletarDisciplina(disciplina.id);

        // 3. Monta tudo
        item.appendChild(texto);
        item.appendChild(btnDeletar);
        
        lista.appendChild(item);
    });
}

// 3. Função para cadastrar (POST)
async function cadastrarDisciplina() {
    // Pegamos os valores dos inputs do HTML
    const nomeInput = document.getElementById("nome").value;
    const profInput = document.getElementById("professor").value;

    // Montamos o JSON igual fazíamos no Thunder Client
    const dados = {
        nome: nomeInput,
        professor: profInput
    };

    try {
        // Enviamos para o Java
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados) // Transforma objeto JS em texto JSON
        });

        if (resposta.ok) {
            alert("Disciplina cadastrada!");
            carregarDisciplinas(); // Recarrega a lista para mostrar o novo item
            // Limpa os inputs
            document.getElementById("nome").value = "";
            document.getElementById("professor").value = "";
        } else {
            alert("Erro ao cadastrar");
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

async function deletarDisciplina(id) {
    // Pergunta de segurança (padrão do navegador)
    if (!confirm("Tem certeza que deseja excluir esta disciplina e todas as tarefas dela?")) {
        return;
    }

    try {
        // Manda o DELETE para o Java: http://localhost:8080/disciplinas/1
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (resposta.ok) {
            alert("Disciplina removida!");
            carregarDisciplinas(); // Recarrega a lista para sumir com o item
        } else {
            alert("Erro ao deletar. Verifique se o servidor está rodando.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

function mostrarTarefas(disciplina) {
    // 1. Guarda o ID na variável global (vamos usar para cadastrar tarefa depois)
    disciplinaSelecionadaId = disciplina.id;

    // 2. Torna o painel visível
    const painel = document.getElementById("painel-tarefas");
    painel.style.display = "block";

    // 3. Atualiza o título
    document.getElementById("titulo-disciplina-selecionada").textContent = `Tarefas de ${disciplina.nome}`;

    // 4. Limpa a lista antiga
    const listaTarefas = document.getElementById("lista-tarefas");
    listaTarefas.innerHTML = "";

    // 5. Desenha as tarefas
    // Verifica se tem tarefas na lista
    if (disciplina.tarefas && disciplina.tarefas.length > 0) {
        disciplina.tarefas.forEach(tarefa => {
            adicionarTarefaNaTela(tarefa);
        });
    } else {
        listaTarefas.innerHTML = "<li>Nenhuma tarefa cadastrada.</li>";
    }
}

async function adicionarTarefa() {
    // 1. Validação de Segurança
    if (!disciplinaSelecionadaId) {
        alert("Nenhuma disciplina selecionada!");
        return;
    }

    // 2. Pegar valores dos inputs
    const tituloInput = document.getElementById("titulo-tarefa");
    const prazoInput = document.getElementById("prazo-tarefa");
    
    const titulo = tituloInput.value;
    const prazo = prazoInput.value;

    if (!titulo || !prazo) {
        alert("Preencha título e prazo!");
        return;
    }

    // 3. Montar o JSON (O DTO TarefaRequestDTO espera titulo e prazo)
    const dados = {
        titulo: titulo,
        prazo: prazo
    };

    try {
        // 4. Enviar o POST
        // URL: http://localhost:8080/disciplinas/1/tarefas
        const url = `${API_URL}/${disciplinaSelecionadaId}/tarefas`;
        
        const resposta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            // 5. Sucesso!
            const novaTarefa = await resposta.json();
            
            // Adiciona visualmente na lista agora mesmo (UX rápida)
            adicionarTarefaNaTela(novaTarefa);
            
            // Limpa os campos
            tituloInput.value = "";
            prazoInput.value = "";
            
            // Atualiza a contagem na lista principal (opcional, mas elegante)
            carregarDisciplinas(); 

        } else {
            alert("Erro ao criar tarefa.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

// Função auxiliar para desenhar uma única tarefa (reaproveita código)
function adicionarTarefaNaTela(tarefa) {
    const listaTarefas = document.getElementById("lista-tarefas");
    
    if (listaTarefas.innerHTML.includes("Nenhuma tarefa")) {
        listaTarefas.innerHTML = "";
    }

    const li = document.createElement("li");
    li.style.marginBottom = "10px"; // Um respiro visual
    
    // 1. Parte do Texto (Título + Data)
    const dataFormatada = new Date(tarefa.prazo).toLocaleDateString('pt-BR');
    const spanTexto = document.createElement("span");
    spanTexto.textContent = `${tarefa.titulo} - ${dataFormatada} `;
    
    // 2. Parte do Status (Dropdown Select)
    const selectStatus = document.createElement("select");
    
    // Opções do Enum
    const opcoes = ["PENDENTE", "EM_PROGRESSO", "CONCLUIDA"];
    opcoes.forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        if (tarefa.status === status) {
            option.selected = true; // Seleciona o que veio do banco
        }
        selectStatus.appendChild(option);
    });

    // Estilo básico dependendo do status
    selectStatus.style.marginRight = "10px";
    selectStatus.style.marginLeft = "10px";
    mudarCorStatus(selectStatus, tarefa.status); // Função visual extra (veja abaixo)

    // O GATILHO DE ATUALIZAÇÃO:
    // Quando o usuário mudar a opção, chama a API
    selectStatus.onchange = () => atualizarStatusTarefa(tarefa.id, selectStatus.value, selectStatus);

    // 3. Botão de Excluir
    const btnDel = document.createElement("button");
    btnDel.textContent = "🗑️";
    btnDel.style.cursor = "pointer";
    btnDel.onclick = () => deletarTarefa(tarefa.id, li);

    // Monta a linha
    li.appendChild(spanTexto);
    li.appendChild(selectStatus);
    li.appendChild(btnDel);
    
    listaTarefas.appendChild(li);
}

// Função para mudar a cor do select (UX Visual)
function mudarCorStatus(select, status) {
    select.style.backgroundColor = "white";
    select.style.color = "black";
    
    if (status === "CONCLUIDA") {
        select.style.backgroundColor = "#d4edda"; // Verde claro
        select.style.color = "#155724";
    } else if (status === "EM_PROGRESSO") {
        select.style.backgroundColor = "#fff3cd"; // Amarelo claro
        select.style.color = "#856404";
    }
}

async function atualizarStatusTarefa(id, novoStatus, elementoSelect) {
    try {
        const urlBase = API_URL.replace("/disciplinas", ""); 
        const urlPatch = `${urlBase}/tarefas/${id}/status`;

        // Lembra que nosso Controller espera o Enum como String crua?
        // Precisamos mandar a string "CONCLUIDA" entre aspas no body.
        
        const resposta = await fetch(urlPatch, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoStatus) // Vai enviar "CONCLUIDA"
        });

        if (resposta.ok) {
            // Sucesso! Atualiza a cor visualmente
            mudarCorStatus(elementoSelect, novoStatus);
        } else {
            alert("Erro ao atualizar status.");
            // Opcional: Voltar o select para o valor antigo
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

async function deletarTarefa(id, elementoHTML) {
    if (!confirm("Tem certeza que deseja remover esta tarefa?")) {
        return;
    }

    try {
        // Agora usamos a URL direta: /tarefas/{id}
        // Nota: Se você mudou a porta para 8081, certifique-se que API_URL está certa
        // Precisamos substituir '/disciplinas' por '/tarefas' na URL base, ou montar manual
        
        // Truque: Como API_URL é ".../disciplinas", vamos ajustar a string para ".../tarefas"
        const urlBase = API_URL.replace("/disciplinas", ""); 
        const urlDelete = `${urlBase}/tarefas/${id}`;

        const resposta = await fetch(urlDelete, {
            method: "DELETE"
        });

        if (resposta.ok) {
            // Mágica de UX: Remove apenas esse <li> da tela
            elementoHTML.remove();
        } else {
            alert("Erro ao deletar tarefa.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
}
// 4. Inicialização
// Assim que a página abrir, carregue a lista
carregarDisciplinas();