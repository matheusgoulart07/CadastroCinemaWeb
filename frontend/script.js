// Endpoint base mapeado no @RequestMapping("/cinema") do CinemaController em Java
const API_BASE_URL = "http://localhost:8080/cinema";

// Seleção dos elementos da interface (DOM)
const formCinema = document.getElementById("form-cinema");
const formBusca = document.getElementById("form-busca");
const areaResultado = document.getElementById("area-resultado");
const feedbackEl = document.getElementById("feedback");

const formTitulo = document.getElementById("form-titulo");
const badgeModo = document.getElementById("badge-modo");
const btnSubmit = document.getElementById("btn-submit");
const btnCancelar = document.getElementById("btn-cancelar");

let temporizadorFeedback;

/**
 * Exibe uma mensagem visual de sucesso ou erro no topo da tela.
 */
function exibirFeedback(mensagem, tipo) {
    clearTimeout(temporizadorFeedback);
    feedbackEl.textContent = mensagem;
    feedbackEl.className = `feedback ${tipo}`;

    temporizadorFeedback = setTimeout(() => {
        feedbackEl.className = "feedback oculto";
    }, 4500);
}

/**
 * Escapa caracteres especiais para evitar problemas ao renderizar textos no HTML.
 */
function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

/**
 * 1. OPERAÇÕES POST (CADASTRAR) E PUT (ATUALIZAR POR ID)
 * Envia os dados do formulário em formato JSON no corpo (body) da requisição HTTP.
 */
formCinema.addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o recarregamento padrão da página

    const idEdicao = document.getElementById("filme-id").value;
    const emModoEdicao = idEdicao !== "";

    // Monta o objeto garantindo a tipagem esperada pela entidade Cinema.java:
    // anoLancamento -> Integer | bilheteria e nota -> Double
    const payloadCinema = {
        nome: document.getElementById("nome").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        anoLancamento: parseInt(document.getElementById("anoLancamento").value, 10),
        bilheteria: parseFloat(document.getElementById("bilheteria").value),
        nota: parseFloat(document.getElementById("nota").value)
    };

    // Define a rota e o verbo HTTP conforme o modo atual (PUT usa ?id={id}, POST usa rota base)
    const url = emModoEdicao ? `${API_BASE_URL}?id=${encodeURIComponent(idEdicao)}` : API_BASE_URL;
    const verboHTTP = emModoEdicao ? "PUT" : "POST";

    try {
        // Realiza a requisição HTTP assíncrona usando Fetch API
        const response = await fetch(url, {
            method: verboHTTP,
            headers: {
                // Informa ao Spring Boot que o corpo da requisição está em JSON
                "Content-Type": "application/json"
            },
            // Converte o objeto JavaScript em uma string JSON para o @RequestBody
            body: JSON.stringify(payloadCinema)
        });

        // Valida se o status HTTP está na faixa de sucesso (200-299)
        if (!response.ok) {
            throw new Error(`Falha na requisição (${response.status})`);
        }

        // Como o backend retorna ResponseEntity<Void> (corpo vazio), não executamos response.json()
        exibirFeedback(
            emModoEdicao ? "Filme atualizado com sucesso!" : "Filme cadastrado com sucesso!",
            "sucesso"
        );

        const tituloSalvo = payloadCinema.nome;
        sairModoEdicao();

        // Atualiza automaticamente o card de consulta com o filme recém-salvo ou editado
        document.getElementById("campo-busca").value = tituloSalvo;
        await consultarFilmePorNome(tituloSalvo);

    } catch (erro) {
        console.error("Erro ao salvar filme:", erro);
        exibirFeedback(
            "Erro ao salvar o filme. Verifique se o backend Java está rodando e se o nome não está duplicado.",
            "erro"
        );
    }
});

/**
 * 2. OPERAÇÃO GET (BUSCAR FILME POR NOME)
 * Envia o nome como Query Param (?nome=...) e exibe o JSON retornado em um card.
 */
formBusca.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nomeBusca = document.getElementById("campo-busca").value.trim();

    if (nomeBusca) {
        await consultarFilmePorNome(nomeBusca);
    }
});

async function consultarFilmePorNome(nome) {
    try {
        // encodeURIComponent codifica espaços e acentos para envio seguro na URL
        const url = `${API_BASE_URL}?nome=${encodeURIComponent(nome)}`;

        const response = await fetch(url, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Filme não encontrado (${response.status})`);
        }

        // Converte o JSON retornado pelo CinemaController em um objeto JavaScript
        const filme = await response.json();
        renderizarCardFilme(filme);

    } catch (erro) {
        console.error("Erro na consulta GET:", erro);
        areaResultado.innerHTML = `
            <div class="estado-vazio">
                <span>🔍</span>
                <p>Nenhum filme encontrado com o título <strong>"${escaparHTML(nome)}"</strong>.</p>
            </div>
        `;
        exibirFeedback("Filme não encontrado no banco de dados.", "erro");
    }
}

/**
 * Constrói dinamicamente o card de destaque com os dados recebidos do backend.
 */
function renderizarCardFilme(filme) {
    const bilheteriaFormatada = (filme.bilheteria ?? 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    const notaFormatada = (filme.nota ?? 0).toFixed(1);

    areaResultado.innerHTML = `
        <article class="filme-card">
            <div class="filme-cabecalho">
                <h3>${escaparHTML(filme.nome)}</h3>
                <span class="filme-nota">★ ${notaFormatada}</span>
            </div>
            <div class="filme-detalhes">
                <p><span>ID no Sistema</span> <strong>#${filme.id}</strong></p>
                <p><span>Gênero</span> <strong>${escaparHTML(filme.genero)}</strong></p>
                <p><span>Ano de Lançamento</span> <strong>${filme.anoLancamento}</strong></p>
                <p><span>Bilheteria</span> <strong>${bilheteriaFormatada}</strong></p>
            </div>
            <div class="filme-acoes">
                <button type="button" id="btn-editar-filme" class="btn btn-editar">Editar</button>
                <button type="button" id="btn-excluir-filme" class="btn btn-excluir">Excluir</button>
            </div>
        </article>
    `;

    // Vincula os eventos de clique aos botões recém-criados no DOM
    document.getElementById("btn-editar-filme").addEventListener("click", () => entrarModoEdicao(filme));
    document.getElementById("btn-excluir-filme").addEventListener("click", () => excluirFilmePorNome(filme.nome));
}

/**
 * Preenche o formulário principal com os dados atuais do filme para disparar um PUT.
 */
function entrarModoEdicao(filme) {
    document.getElementById("filme-id").value = filme.id;
    document.getElementById("nome").value = filme.nome;
    document.getElementById("genero").value = filme.genero;
    document.getElementById("anoLancamento").value = filme.anoLancamento;
    document.getElementById("bilheteria").value = filme.bilheteria;
    document.getElementById("nota").value = filme.nota;

    formTitulo.textContent = `Editar Filme #${filme.id}`;
    badgeModo.textContent = "Modo Edição (PUT)";
    badgeModo.className = "badge badge-edicao";
    btnSubmit.textContent = "Atualizar Filme";
    btnCancelar.classList.remove("oculto");
}

/**
 * Restaura o formulário para o estado inicial de cadastro (POST).
 */
function sairModoEdicao() {
    formCinema.reset();
    document.getElementById("filme-id").value = "";

    formTitulo.textContent = "Cadastrar Novo Filme";
    badgeModo.textContent = "Novo Registro";
    badgeModo.className = "badge badge-cadastro";
    btnSubmit.textContent = "Salvar Filme";
    btnCancelar.classList.add("oculto");
}

btnCancelar.addEventListener("click", sairModoEdicao);

/**
 * 3. OPERAÇÃO DELETE (EXCLUIR FILME POR NOME)
 * Solicita confirmação do usuário e envia DELETE para /cinema?nome={nome}.
 */
async function excluirFilmePorNome(nome) {
    const confirmado = window.confirm(`Deseja realmente excluir o filme "${nome}"?`);
    if (!confirmado) return;

    try {
        const url = `${API_BASE_URL}?nome=${encodeURIComponent(nome)}`;

        const response = await fetch(url, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir (${response.status})`);
        }

        // Resposta 200 OK com corpo vazio: limpa o card da tela e notifica o usuário
        exibirFeedback(`Filme "${nome}" excluído com sucesso!`, "sucesso");
        document.getElementById("campo-busca").value = "";
        areaResultado.innerHTML = `
            <div class="estado-vazio">
                <span>🗑️</span>
                <p>Filme excluído. Utilize a busca acima para consultar outro título.</p>
            </div>
        `;

    } catch (erro) {
        console.error("Erro na requisição DELETE:", erro);
        exibirFeedback("Não foi possível excluir o filme no servidor.", "erro");
    }
}