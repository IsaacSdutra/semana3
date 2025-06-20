const urlBase = 'http://localhost:3000';

const destaquesContainer = document.querySelector('.carousel-slide');
const todosFilmesContainer = document.querySelector('.card-grid');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');

const filmeDetalhesContainer = document.getElementById('filme-detalhes');
const filmeFotosContainer = document.getElementById('filme-fotos');

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

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

let filmesDestaque = [];
let todosOsFilmes = [];
let destaqueIndex = 0;
let currentUser = null;

function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;
  messageBox.classList.remove('hidden');
  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, 3000);
}

async function fetchCurrentUser() {
  const userId = sessionStorage.getItem('loggedUserId');
  if (userId) {
    try {
      const response = await fetch(`${urlBase}/usuarios/${userId}`);
      if (response.ok) {
        currentUser = await response.json();
      } else {
        console.error('Erro ao buscar usuário logado:', response.status);
        sessionStorage.removeItem('loggedUserId');
      }
    } catch (error) {
      console.error('Erro de rede ao buscar usuário logado:', error);
      sessionStorage.removeItem('loggedUserId');
    }
  }
  updateHeaderNav();
}

function updateHeaderNav() {
  const authLink = document.getElementById('auth-link');
  const cadastroFilmesLink = document.getElementById('cadastro-filmes-link');
  const favoritosLink = document.getElementById('favoritos-link');
  const estatisticasLink = document.getElementById('estatisticas-link');

  if (currentUser) {
    authLink.href = '#';
    authLink.textContent = 'Sair';
    authLink.onclick = logout;
    favoritosLink.style.display = 'inline-block';
    if (currentUser.admin) {
      cadastroFilmesLink.style.display = 'inline-block';
      estatisticasLink.style.display = 'inline-block';
    } else {
      cadastroFilmesLink.style.display = 'none';
      estatisticasLink.style.display = 'none';
    }
  } else {
    authLink.href = 'login.html';
    authLink.textContent = 'Login';
    authLink.onclick = null;
    favoritosLink.style.display = 'none';
    cadastroFilmesLink.style.display = 'none';
    estatisticasLink.style.display = 'none';
  }
}

function logout() {
  sessionStorage.removeItem('loggedUserId');
  currentUser = null;
  updateHeaderNav();
  if (window.location.pathname.includes("favoritos.html")) {
    window.location.href = 'index.html';
  } else {
    buscarFilmes();
  }
  showMessage('Você foi desconectado.', 'success');
}

async function buscarFilmes(searchTerm = '') {
  try {
    const response = await fetch(`${urlBase}/filmes`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes: ${response.status}`);
    }
    const data = await response.json();
    todosOsFilmes = data.filter(filme => filme.titulo && filme.descricao);

    let filteredFilmes = todosOsFilmes;
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredFilmes = todosOsFilmes.filter(filme =>
        (filme.titulo && filme.titulo.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (filme.descricao && filme.descricao.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    filmesDestaque = filteredFilmes.filter(filme => filme.destaque);

    if (window.location.pathname.includes("index.html") || window.location.pathname === '/') {
      mostrarDestaque();
      mostrarTodosFilmes(filteredFilmes);
    }

    if (window.location.pathname.includes("cadastro_filmes.html")) {
      renderFilmesTable();
    }

    if (window.location.pathname.includes("estatisticas.html")) {
      renderizarGraficoGeneros();
    }

    if (window.location.pathname.includes("favoritos.html")) {
      mostrarFilmesFavoritos();
    }

  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    if (destaquesContainer && todosFilmesContainer) {
      destaquesContainer.innerHTML = `<div class="erro">Erro ao carregar filmes: ${error.message}</div>`;
      todosFilmesContainer.innerHTML = `<div class="erro">Erro ao carregar filmes: ${error.message}</div>`;
    }
    if (filmesTableBody) {
      filmesTableBody.innerHTML = `<tr><td colspan="6" class="erro">Erro ao carregar filmes: ${error.message}</td></tr>`;
    }
    if (document.getElementById('generosChart')) {
      const chartContainer = document.querySelector('.grafico-container');
      if (chartContainer) {
        chartContainer.innerHTML = `<div class="erro">Erro ao carregar dados para o gráfico: ${error.message}</div>`;
      }
    }
  }
}

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

function mostrarTodosFilmes(filmesParaMostrar = todosOsFilmes) {
  if (todosFilmesContainer) {
    todosFilmesContainer.innerHTML = '';
    if (filmesParaMostrar.length === 0) {
      todosFilmesContainer.innerHTML = '<p>Nenhum filme encontrado com os critérios de busca.</p>';
      return;
    }
    filmesParaMostrar.forEach(filme => {
      const isFavorite = currentUser && currentUser.favoritos && currentUser.favoritos.includes(filme.id);
      const favoriteIconClass = isFavorite ? 'fa-solid' : 'fa-regular';
      const favoriteButton = currentUser ? `
        <button class="favorite-btn" data-id="${filme.id}" data-isfavorite="${isFavorite}">
          <i class="${favoriteIconClass} fa-heart"></i>
        </button>` : '';

      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${filme.imagem_principal}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='https://placehold.co/300x400/CCCCCC/333333?text=Imagem+Nao+Disponivel';">
        <h3>${filme.titulo}</h3>
        <p>${filme.genero}</p>
        ${favoriteButton}
        <a href="detalhes.html?id=${filme.id}">Ver Detalhes</a>
      `;
      todosFilmesContainer.appendChild(card);
    });

    if (currentUser) {
      document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', toggleFavorite);
      });
    }
  }
}

async function toggleFavorite(event) {
  if (!currentUser) {
    showMessage('Faça login para adicionar filmes aos favoritos.', 'error');
    return;
  }

  const button = event.currentTarget;
  const filmeId = button.dataset.id;
  let isFavorite = button.dataset.isfavorite === 'true';

  try {
    let updatedFavoritos = [...(currentUser.favoritos || [])];
    if (isFavorite) {
      updatedFavoritos = updatedFavoritos.filter(id => id !== filmeId);
    } else {
      updatedFavoritos.push(filmeId);
    }

    const response = await fetch(`${urlBase}/usuarios/${currentUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ favoritos: updatedFavoritos })
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar favoritos: ${response.status}`);
    }

    currentUser.favoritos = updatedFavoritos;
    button.dataset.isfavorite = !isFavorite;
    const icon = button.querySelector('i');
    if (isFavorite) {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
      showMessage('Filme removido dos favoritos.', 'success');
    } else {
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
      showMessage('Filme adicionado aos favoritos!', 'success');
    }
    if (window.location.pathname.includes("favoritos.html")) {
      mostrarFilmesFavoritos();
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    showMessage(`Erro ao alternar favorito: ${error.message}`, 'error');
  }
}

function getFilmePorId(id) {
  return todosOsFilmes.find(filme => filme.id === id);
}

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

if (window.location.pathname.includes("detalhes.html") && filmeDetalhesContainer && filmeFotosContainer) {
  const urlParams = new URLSearchParams(window.location.search);
  const filmeId = urlParams.get('id');

  async function buscarFilmeDetalhes(id) {
    try {
      const response = await fetch(`${urlBase}/filmes/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes do filme: ${response.status}`);
      }
      const filme = await response.json();
      await fetchCurrentUser();

      if (filme) {
        const isFavorite = currentUser && currentUser.favoritos && currentUser.favoritos.includes(filme.id);
        const favoriteIconClass = isFavorite ? 'fa-solid' : 'fa-regular';
        const favoriteButton = currentUser ? `
          <button class="favorite-btn" data-id="${filme.id}" data-isfavorite="${isFavorite}">
            <i class="${favoriteIconClass} fa-heart fa-2x"></i>
          </button>` : '';

        filmeDetalhesContainer.innerHTML = `
          <img src="${filme.imagem_principal}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/CCCCCC/333333?text=Imagem+Nao+Disponivel';">
          <h3>${filme.titulo} ${favoriteButton}</h3>
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

        if (currentUser) {
          document.querySelector('#filme-detalhes .favorite-btn').addEventListener('click', toggleFavorite);
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

if (window.location.pathname.includes("cadastro_filmes.html") && filmeForm) {

  function renderFilmesTable() {
    if (!filmesTableBody) return;

    filmesTableBody.innerHTML = '';
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
    submitButton.textContent = 'Salvar Filme';
  }

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
      imagensComplementaresInput.value = JSON.stringify(filme.imagens_complementares || [], null, 2);
      destaqueInput.checked = filme.destaque;
      submitButton.textContent = 'Atualizar Filme';
      showMessage('Filme carregado para edição.', 'success');
    } catch (error) {
      console.error('Erro ao carregar filme para edição:', error);
      showMessage(`Erro ao carregar filme para edição: ${error.message}`, 'error');
    }
  }

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
      imagens_complementares = imagensComplementaresInput.value ? JSON.parse(imagensComplementaresInput.value) : [];
    } catch (e) {
      showMessage('Formato inválido para Imagens Complementares. Por favor, use um JSON array válido.', 'error');
      console.error('Erro ao parsear JSON de imagens complementares:', e);
      return;
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
      clearForm();
      buscarFilmes();
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
      showMessage(`Erro ao salvar filme: ${error.message}`, 'error');
    }
  });

  async function deleteFilme(id) {
    const confirmDelete = confirm('Tem certeza que deseja excluir este filme?');
    if (confirmDelete) {
      try {
        const response = await fetch(`${urlBase}/filmes/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Erro ao excluir filme: ${response.status}`);
        }
        showMessage('Filme excluído com sucesso!', 'success');
        buscarFilmes();
      } catch (error) {
        console.error('Erro ao excluir filme:', error);
        showMessage(`Erro ao excluir filme: ${error.message}`, 'error');
      }
    }
  }

  clearFormButton.addEventListener('click', clearForm);

  fetchCurrentUser();
  buscarFilmes();
}

if (window.location.pathname.includes("estatisticas.html")) {
  function renderizarGraficoGeneros() {
    const generosCount = {};
    todosOsFilmes.forEach(filme => {
      if (filme.genero && typeof filme.genero === 'string') {
        const generos = filme.genero.split(',').map(g => g.trim());
        generos.forEach(genero => {
          if (genero) {
            generosCount[genero] = (generosCount[genero] || 0) + 1;
          }
        });
      }
    });

    const labels = Object.keys(generosCount);
    const data = Object.values(generosCount);

    const ctx = document.getElementById('generosChart');
    if (ctx) {
      if (window.myPieChart instanceof Chart) {
        window.myPieChart.destroy();
      }
      window.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9900',
              '#C9CBCE'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Distribuição de Filmes por Gênero',
              font: {
                size: 18
              },
              color: '#333'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null) {
                    label += context.parsed + ' filmes (' + (context.parsed / data.reduce((a, b) => a + b, 0) * 100).toFixed(2) + '%)';
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    }
  }
  fetchCurrentUser();
  buscarFilmes();
}

if (window.location.pathname.includes("login.html")) {
  const loginForm = document.getElementById('login-form');
  const loginInput = document.getElementById('login');
  const senhaInput = document.getElementById('senha');
  const loginMessageBox = document.getElementById('login-message-box');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const login = loginInput.value;
      const senha = senhaInput.value;

      try {
        const response = await fetch(`${urlBase}/usuarios?login=${login}&senha=${senha}`);
        if (!response.ok) {
          throw new Error(`Erro ao tentar login: ${response.status}`);
        }
        const users = await response.json();

        if (users.length > 0) {
          sessionStorage.setItem('loggedUserId', users[0].id);
          window.location.href = 'index.html';
        } else {
          loginMessageBox.textContent = 'Login ou senha inválidos.';
          loginMessageBox.className = 'message-box error';
          loginMessageBox.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Erro de login:', error);
        loginMessageBox.textContent = `Erro ao fazer login: ${error.message}`;
        loginMessageBox.className = 'message-box error';
        loginMessageBox.classList.remove('hidden');
      }
    });
  }
}

if (window.location.pathname.includes("cadastro_usuario.html")) {
  const cadastroUsuarioForm = document.getElementById('cadastro-usuario-form');
  const nomeUsuarioInput = document.getElementById('nome-usuario');
  const emailUsuarioInput = document.getElementById('email-usuario');
  const loginUsuarioInput = document.getElementById('login-usuario');
  const senhaUsuarioInput = document.getElementById('senha-usuario');
  const cadastroUsuarioMessageBox = document.getElementById('cadastro-usuario-message-box');

  if (cadastroUsuarioForm) {
    cadastroUsuarioForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nome = nomeUsuarioInput.value;
      const email = emailUsuarioInput.value;
      const login = loginUsuarioInput.value;
      const senha = senhaUsuarioInput.value;

      try {
        const checkUserResponse = await fetch(`${urlBase}/usuarios?login=${login}`);
        const existingUsers = await checkUserResponse.json();

        if (existingUsers.length > 0) {
          cadastroUsuarioMessageBox.textContent = 'Nome de usuário já existe. Escolha outro.';
          cadastroUsuarioMessageBox.className = 'message-box error';
          cadastroUsuarioMessageBox.classList.remove('hidden');
          return;
        }

        const newUser = {
          id: crypto.randomUUID(),
          nome,
          email,
          login,
          senha,
          admin: false,
          favoritos: []
        };

        const response = await fetch(`${urlBase}/usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        });

        if (!response.ok) {
          throw new Error(`Erro ao cadastrar usuário: ${response.status}`);
        }

        cadastroUsuarioMessageBox.textContent = 'Usuário cadastrado com sucesso!';
        cadastroUsuarioMessageBox.className = 'message-box success';
        cadastroUsuarioMessageBox.classList.remove('hidden');
        cadastroUsuarioForm.reset();
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);

      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        cadastroUsuarioMessageBox.textContent = `Erro ao cadastrar usuário: ${error.message}`;
        cadastroUsuarioMessageBox.className = 'message-box error';
        cadastroUsuarioMessageBox.classList.remove('hidden');
      }
    });
  }
}

if (window.location.pathname.includes("favoritos.html")) {
  const favoritosContainer = document.getElementById('favoritos-grid');

  async function mostrarFilmesFavoritos() {
    if (!currentUser || !currentUser.favoritos || currentUser.favoritos.length === 0) {
      if (favoritosContainer) {
        favoritosContainer.innerHTML = '<p>Você não tem filmes favoritos ainda.</p>';
      }
      return;
    }

    if (favoritosContainer) {
      favoritosContainer.innerHTML = '';
      const filmesFavoritos = todosOsFilmes.filter(filme => currentUser.favoritos.includes(filme.id));

      if (filmesFavoritos.length === 0) {
        favoritosContainer.innerHTML = '<p>Você não tem filmes favoritos ainda.</p>';
        return;
      }

      filmesFavoritos.forEach(filme => {
        const isFavorite = true;
        const favoriteIconClass = 'fa-solid';
        const favoriteButton = currentUser ? `
          <button class="favorite-btn" data-id="${filme.id}" data-isfavorite="${isFavorite}">
            <i class="${favoriteIconClass} fa-heart"></i>
          </button>` : '';

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${filme.imagem_principal}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='https://placehold.co/300x400/CCCCCC/333333?text=Imagem+Nao+Disponivel';">
          <h3>${filme.titulo}</h3>
          <p>${filme.genero}</p>
          ${favoriteButton}
          <a href="detalhes.html?id=${filme.id}">Ver Detalhes</a>
        `;
        favoritosContainer.appendChild(card);
      });

      document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', toggleFavorite);
      });
    }
  }
  fetchCurrentUser();
  buscarFilmes();
}

if (window.location.pathname.includes("index.html") || window.location.pathname === '/') {
  fetchCurrentUser();
  buscarFilmes();

  if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
      buscarFilmes(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        buscarFilmes(searchInput.value);
      }
    });
  }
} else if (!window.location.pathname.includes("detalhes.html") &&
  !window.location.pathname.includes("cadastro_filmes.html") &&
  !window.location.pathname.includes("estatisticas.html") &&
  !window.location.pathname.includes("login.html") &&
  !window.location.pathname.includes("cadastro_usuario.html") &&
  !window.location.pathname.includes("favoritos.html")) {
  fetchCurrentUser();
  buscarFilmes();
}