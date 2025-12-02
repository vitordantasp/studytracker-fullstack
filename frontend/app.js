// A URL da sua API Java (Back-end)
const API_URL = "http://localhost:8080/disciplinas";

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
        
        // 2. O botão de excluir
        const btnDeletar = document.createElement("button");
        btnDeletar.textContent = "🗑️"; // Ícone de lixeira
        btnDeletar.style.marginLeft = "10px"; // Um pouco de espaço
        btnDeletar.style.cursor = "pointer";
        
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

// 4. Inicialização
// Assim que a página abrir, carregue a lista
carregarDisciplinas();