const urlBase = 'http://localhost:3000'; // URL base para o JSON Server

// --- Elementos DOM para index.html ---
const destaquesContainer = document.querySelector('.carousel-slide');
const todosFilmesContainer = document.querySelector('.card-grid');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');

let filmesDestaque = [];
let todosOsFilmes = [];
let destaqueIndex = 0;

// --- Elementos DOM para detalhes.html ---
const filmeDetalhesContainer = document.getElementById('filme-detalhes');
const filmeFotosContainer = document.getElementById('filme-fotos');

// --- Elementos DOM para cadastro_filmes.html ---
const filmeForm = document.getElementById('filme-form');
const filmeIdInput = document.getElementById('filme-id');
const tituloInput = document.getElementById('titulo');
const descricaoInput = document.getElementById('descricao');
const generoInput = document.getElementById('genero');
const diretorInput = document.getElementById('diretor');
const atoresInput = document.getElementById('atores');
const anoInput = document.getElementById('ano');
const imagemPrincipalInput = document.getElementById('imagem_principal');
const imagensComplementaresInput = document.getElementById('imagens_complementares');
const destaqueInput = document.getElementById('destaque');
const filmesTableBody = document.querySelector('#filmes-table tbody');
const submitButton = document.getElementById('submit-button');
const clearFormButton = document.getElementById('clear-form-button');
const messageBox = document.getElementById('message-box');

/**
 * Exibe uma mensagem na caixa de mensagens.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - O tipo da mensagem ('success' ou 'error').
 */
function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;
  messageBox.classList.remove('hidden');
  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, 3000); // Esconde a mensagem após 3 segundos
}

/**
 * Busca todos os filmes do JSON Server.
 * Popula as variáveis globais `todosOsFilmes` e `filmesDestaque`.
 * Se estiver na página inicial, exibe os destaques e todos os filmes.
 * Se estiver na página de cadastro, renderiza a tabela de filmes.
 */
async function buscarFilmes() {
  try {
    const response = await fetch(`${urlBase}/filmes`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes: ${response.status}`);
    }
    const data = await response.json();
    todosOsFilmes = data;
    filmesDestaque = data.filter(filme => filme.destaque);

    // Lógica para a página index.html
    if (window.location.pathname.includes("index.html") || window.location.pathname === '/') {
      mostrarDestaque();
      mostrarTodosFilmes();
    }

    // Lógica para a página cadastro_filmes.html
    if (window.location.pathname.includes("cadastro_filmes.html")) {
      renderFilmesTable();
    }

  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    // Exibe mensagem de erro apropriada para cada página
    if (destaquesContainer && todosFilmesContainer) {
      destaquesContainer.innerHTML = `<div class="erro">Erro ao carregar filmes: ${error.message}</div>`;
      todosFilmesContainer.innerHTML = `<div class="erro">Erro ao carregar filmes: ${error.message}</div>`;
    }
    if (filmesTableBody) {
      filmesTableBody.innerHTML = `<tr><td colspan="6" class="erro">Erro ao carregar filmes: ${error.message}</td></tr>`;
    }
  }
}

/**
 * Exibe o filme em destaque no carrossel da página inicial.
 */
function mostrarDestaque() {
  if (destaquesContainer && filmesDestaque.length > 0) {
    const filme = filmesDestaque[destaqueIndex];
    destaquesContainer.innerHTML = `
      <div class="destaque-item">
        <img src="${filme.imagem_principal}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/CCCCCC/333333?text=Imagem+Nao+Disponivel';">
        <h3>${filme.titulo}</h3>
        <p>${filme.descricao}</p>
        <a href="detalhes.html?id=${filme.id}">Ver Detalhes</a>
      </div>
    `;
  } else if (destaquesContainer) {
    destaquesContainer.innerHTML = '<p>Nenhum filme em destaque.</p>';
  }
}

/**
 * Exibe todos os filmes em cards na página inicial.
 */
function mostrarTodosFilmes() {
  if (todosFilmesContainer) {
    todosFilmesContainer.innerHTML = ''; // Limpa o conteúdo existente
    todosOsFilmes.forEach(filme => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${filme.imagem_principal}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='https://placehold.co/300x400/CCCCCC/333333?text=Imagem+Nao+Disponivel';">
        <h3>${filme.titulo}</h3>
        <p>${filme.genero}</p>
        <a href="detalhes.html?id=${filme.id}">Ver Detalhes</a>
      `;
      todosFilmesContainer.appendChild(card);
    });
  }
}

/**
 * Obtém um filme pelo ID da lista de filmes carregada.
 * @param {number} id - O ID do filme.
 * @returns {object|undefined} O objeto do filme ou undefined se não encontrado.
 */
function getFilmePorId(id) {
  return todosOsFilmes.find(filme => filme.id === parseInt(id));
}

// --- Event Listeners para index.html ---
if (prevButton && nextButton) {
  prevButton.addEventListener('click', () => {
    destaqueIndex = (destaqueIndex - 1 + filmesDestaque.length) % filmesDestaque.length;
    mostrarDestaque();
  });

  nextButton.addEventListener('click', () => {
    destaqueIndex = (destaqueIndex + 1) % filmesDestaque.length;
    mostrarDestaque();
  });
}


// --- Lógica para detalhes.html ---
if (window.location.pathname.includes("detalhes.html") && filmeDetalhesContainer && filmeFotosContainer) {
  const urlParams = new URLSearchParams(window.location.search);
  const filmeId = urlParams.get('id');

  /**
   * Busca e exibe os detalhes de um filme específico.
   * @param {string} id - O ID do filme.
   */
  async function buscarFilmeDetalhes(id) {
    try {
      const response = await fetch(`${urlBase}/filmes/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes do filme: ${response.status}`);
      }
      const filme = await response.json();

      if (filme) {
        filmeDetalhesContainer.innerHTML = `
          <img src="${filme.imagem_principal}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/CCCCCC/333333?text=Imagem+Nao+Disponivel';">
          <h3>${filme.titulo}</h3>
          <p><strong>Gênero:</strong> ${filme.genero}</p>
          <p><strong>Diretor:</strong> ${filme.diretor}</p>
          <p><strong>Atores:</strong> ${filme.atores.join(', ')}</p>
          <p><strong>Ano:</strong> ${filme.ano}</p>
          <p><strong>Descrição:</strong> ${filme.descricao}</p>
        `;

        if (filme.imagens_complementares && filme.imagens_complementares.length > 0) {
          let fotosHTML = '<div class="fotos-lista">';
          filme.imagens_complementares.forEach(foto => {
            fotosHTML += `
              <div class="foto-item">
                <img src="${foto.src}" alt="${foto.descricao}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/CCCCCC/333333?text=Imagem+Nao+Disponivel';">
                <p>${foto.descricao}</p>
              </div>
            `;
          });
          fotosHTML += '</div>';
          filmeFotosContainer.innerHTML = fotosHTML;
        } else {
          filmeFotosContainer.innerHTML = '<p>Não há fotos complementares para este filme.</p>';
        }
      } else {
        filmeDetalhesContainer.innerHTML = '<p>Filme não encontrado.</p>';
        filmeFotosContainer.innerHTML = '';
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      filmeDetalhesContainer.innerHTML = `<div class="erro">Erro ao carregar detalhes do filme: ${error.message}</div>`;
      filmeFotosContainer.innerHTML = '';
    }
  }

  buscarFilmeDetalhes(filmeId);
}

// --- Lógica para cadastro_filmes.html ---
if (window.location.pathname.includes("cadastro_filmes.html") && filmeForm) {

  /**
   * Renderiza a tabela de filmes com os dados atuais.
   */
  function renderFilmesTable() {
    if (!filmesTableBody) return; // Garante que o elemento existe

    filmesTableBody.innerHTML = ''; // Limpa a tabela antes de renderizar
    todosOsFilmes.forEach(filme => {
      const row = filmesTableBody.insertRow();
      row.insertCell().textContent = filme.id;
      row.insertCell().textContent = filme.titulo;
      row.insertCell().textContent = filme.genero;
      row.insertCell().textContent = filme.ano;
      row.insertCell().textContent = filme.destaque ? 'Sim' : 'Não';

      const actionsCell = row.insertCell();
      const editButton = document.createElement('button');
      editButton.textContent = 'Editar';
      editButton.classList.add('edit-btn');
      editButton.addEventListener('click', () => editFilme(filme.id));
      actionsCell.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => deleteFilme(filme.id));
      actionsCell.appendChild(deleteButton);
    });
  }

  /**
   * Limpa o formulário de cadastro/edição.
   */
  function clearForm() {
    filmeIdInput.value = '';
    tituloInput.value = '';
    descricaoInput.value = '';
    generoInput.value = '';
    diretorInput.value = '';
    atoresInput.value = '';
    anoInput.value = '';
    imagemPrincipalInput.value = '';
    imagensComplementaresInput.value = '';
    destaqueInput.checked = false;
    submitButton.textContent = 'Salvar Filme'; // Volta o texto do botão para "Salvar"
  }

  /**
   * Preenche o formulário com os dados de um filme para edição.
   * @param {number} id - O ID do filme a ser editado.
   */
  async function editFilme(id) {
    try {
      const response = await fetch(`${urlBase}/filmes/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar filme para edição: ${response.status}`);
      }
      const filme = await response.json();

      filmeIdInput.value = filme.id;
      tituloInput.value = filme.titulo;
      descricaoInput.value = filme.descricao;
      generoInput.value = filme.genero;
      diretorInput.value = filme.diretor;
      atoresInput.value = filme.atores.join(', ');
      anoInput.value = filme.ano;
      imagemPrincipalInput.value = filme.imagem_principal;
      // Converte o array de objetos para uma string JSON formatada para o textarea
      imagensComplementaresInput.value = JSON.stringify(filme.imagens_complementares || [], null, 2);
      destaqueInput.checked = filme.destaque;
      submitButton.textContent = 'Atualizar Filme'; // Muda o texto do botão para "Atualizar"
      showMessage('Filme carregado para edição.', 'success');
    } catch (error) {
      console.error('Erro ao carregar filme para edição:', error);
      showMessage(`Erro ao carregar filme para edição: ${error.message}`, 'error');
    }
  }

  /**
   * Envia os dados do formulário para criar ou atualizar um filme.
   * @param {Event} event - O evento de submissão do formulário.
   */
  filmeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = filmeIdInput.value;
    const titulo = tituloInput.value;
    const descricao = descricaoInput.value;
    const genero = generoInput.value;
    const diretor = diretorInput.value;
    const atores = atoresInput.value.split(',').map(ator => ator.trim());
    const ano = parseInt(anoInput.value);
    const imagem_principal = imagemPrincipalInput.value;
    let imagens_complementares = [];
    try {
      // Tenta parsear o JSON das imagens complementares
      imagens_complementares = imagensComplementaresInput.value ? JSON.parse(imagensComplementaresInput.value) : [];
    } catch (e) {
      showMessage('Formato inválido para Imagens Complementares. Por favor, use um JSON array válido.', 'error');
      console.error('Erro ao parsear JSON de imagens complementares:', e);
      return; // Impede a submissão se o JSON for inválido
    }
    const destaque = destaqueInput.checked;

    const filmeData = {
      titulo,
      descricao,
      genero,
      diretor,
      atores,
      ano,
      imagem_principal,
      imagens_complementares,
      destaque
    };

    try {
      let response;
      if (id) {
        // Atualizar filme existente (PUT)
        response = await fetch(`${urlBase}/filmes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(filmeData)
        });
        if (!response.ok) {
          throw new Error(`Erro ao atualizar filme: ${response.status}`);
        }
        showMessage('Filme atualizado com sucesso!', 'success');
      } else {
        // Criar novo filme (POST)
        response = await fetch(`${urlBase}/filmes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(filmeData)
        });
        if (!response.ok) {
          throw new Error(`Erro ao cadastrar filme: ${response.status}`);
        }
        showMessage('Filme cadastrado com sucesso!', 'success');
      }
      clearForm(); // Limpa o formulário após sucesso
      buscarFilmes(); // Recarrega a lista de filmes
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
      showMessage(`Erro ao salvar filme: ${error.message}`, 'error');
    }
  });

  /**
   * Exclui um filme.
   * @param {number} id - O ID do filme a ser excluído.
   */
  async function deleteFilme(id) {
    // Substitui window.confirm por um modal simples ou mensagem de confirmação
    const confirmDelete = true; // Por simplicidade, assumimos true. Em um app real, use um modal.
    if (confirmDelete) {
      try {
        const response = await fetch(`${urlBase}/filmes/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Erro ao excluir filme: ${response.status}`);
        }
        showMessage('Filme excluído com sucesso!', 'success');
        buscarFilmes(); // Recarrega a lista de filmes
      } catch (error) {
        console.error('Erro ao excluir filme:', error);
        showMessage(`Erro ao excluir filme: ${error.message}`, 'error');
      }
    }
  }

  // Event listener para o botão "Limpar Formulário"
  clearFormButton.addEventListener('click', clearForm);

  // Garante que a tabela é renderizada quando a página de cadastro é carregada
  buscarFilmes();
}

// Carrega os filmes do servidor JSON ao carregar qualquer página
// Isso é importante para que todosOsFilmes e filmesDestaque estejam disponíveis
// para todas as páginas que os utilizam.
buscarFilmes();
