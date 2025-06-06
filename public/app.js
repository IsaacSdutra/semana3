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

let filmesDestaque = [];
let todosOsFilmes = [];
let destaqueIndex = 0;

function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;
  messageBox.classList.remove('hidden');
  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, 3000);
}

async function buscarFilmes() {
  try {
    const response = await fetch(`${urlBase}/filmes`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes: ${response.status}`);
    }
    const data = await response.json();
    todosOsFilmes = data;
    filmesDestaque = data.filter(filme => filme.destaque);

    if (window.location.pathname.includes("index.html") || window.location.pathname === '/') {
      mostrarDestaque();
      mostrarTodosFilmes();
    }

    if (window.location.pathname.includes("cadastro_filmes.html")) {
      renderFilmesTable();
    }

    if (window.location.pathname.includes("estatisticas.html")) {
      renderizarGraficoGeneros();
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

function mostrarTodosFilmes() {
  if (todosFilmesContainer) {
    todosFilmesContainer.innerHTML = '';
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

function getFilmePorId(id) {
  return todosOsFilmes.find(filme => filme.id === parseInt(id));
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
    const confirmDelete = true;
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

  buscarFilmes();
}

if (window.location.pathname.includes("estatisticas.html")) {
    function renderizarGraficoGeneros() {
        const generosCount = {};
        todosOsFilmes.forEach(filme => {
            // Verifique se filme.genero existe e é uma string antes de processar
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
    buscarFilmes();
} else {
    buscarFilmes();
}