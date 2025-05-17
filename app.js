const destaquesContainer = document.querySelector('.carousel-slide');
const todosFilmesContainer = document.querySelector('.card-grid');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
let filmesDestaque = [];
let todosOsFilmes = [];
let destaqueIndex = 0;
const urlBase = 'http://localhost:3000';

async function buscarFilmes() {
  try {
    const response = await fetch(`${urlBase}/filmes`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes: ${response.status}`);
    }
    const data = await response.json();
    todosOsFilmes = data;
    filmesDestaque = data.filter(filme => filme.destaque);
    mostrarDestaque();
    mostrarTodosFilmes();
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    // Aqui você pode adicionar uma mensagem de erro na página, se desejar
    destaquesContainer.innerHTML = `<div class="erro">Erro ao carregar filmes: ${error.message}</div>`;
    todosFilmesContainer.innerHTML = `<div class="erro">Erro ao carregar filmes: ${error.message}</div>`;
  }
}

function mostrarDestaque() {
  if (filmesDestaque.length > 0) {
    const filme = filmesDestaque[destaqueIndex];
    destaquesContainer.innerHTML = `
      <div class="destaque-item">
        <img src="${filme.imagem_principal}" alt="${filme.titulo}">
        <h3>${filme.titulo}</h3>
        <p>${filme.descricao}</p>
        <a href="detalhes.html?id=${filme.id}">Ver Detalhes</a>
      </div>
    `;
  } else {
    destaquesContainer.innerHTML = '<p>Nenhum filme em destaque.</p>';
  }
}

function mostrarTodosFilmes() {
  todosOsFilmes.forEach(filme => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${filme.imagem_principal}" alt="${filme.titulo}">
      <h3>${filme.titulo}</h3>
      <p>${filme.genero}</p>
      <a href="detalhes.html?id=${filme.id}">Ver Detalhes</a>
    `;
    todosFilmesContainer.appendChild(card);
  });
}

function getFilmePorId(id) {
  return todosOsFilmes.find(filme => filme.id === parseInt(id));
}

prevButton.addEventListener('click', () => {
  destaqueIndex = (destaqueIndex - 1 + filmesDestaque.length) % filmesDestaque.length;
  mostrarDestaque();
});

nextButton.addEventListener('click', () => {
  destaqueIndex = (destaqueIndex + 1) % filmesDestaque.length;
  mostrarDestaque();
});

// Carrega os filmes do servidor JSON
buscarFilmes();

// Exibe os destaques e todos os filmes
// mostrarDestaque(); // Removido para carregar dinamicamente
// mostrarTodosFilmes(); // Removido para carregar dinamicamente

// app.js para detalhes.html
if (window.location.pathname.includes("detalhes.html")) {
  const filmeDetalhesContainer = document.getElementById('filme-detalhes');
  const filmeFotosContainer = document.getElementById('filme-fotos');
  const urlParams = new URLSearchParams(window.location.search);
  const filmeId = urlParams.get('id');

  async function buscarFilmeDetalhes(id) {
    try {
      const response = await fetch(`${urlBase}/filmes/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes do filme: ${response.status}`);
      }
      const filme = await response.json();

      if (filme) {
        filmeDetalhesContainer.innerHTML = `
          <img src="${filme.imagem_principal}" alt="${filme.titulo}">
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
                <img src="${foto.src}" alt="${foto.descricao}">
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
