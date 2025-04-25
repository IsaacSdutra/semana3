const dados = {
  "filmes": [
    {
      "id": 1,
      "titulo": "Vingadores: Ultimato",
      "descricao": "O culminar de anos de história, onde os heróis restantes devem reverter os atos de Thanos.",
      "genero": "Ação, Aventura, Drama",
      "diretor": "Anthony e Joe Russo",
      "atores": ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
      "destaque": true,
      "ano": 2019,
      "imagem_principal": "https://via.placeholder.com/300x450",
      "imagens_complementares": [
        {"id": 1, "src": "https://via.placeholder.com/150x100", "descricao": "Cena de batalha"},
        {"id": 2, "src": "https://via.placeholder.com/150x100", "descricao": "Heróis reunidos"},
        {"id": 3, "src": "https://via.placeholder.com/150x100", "descricao": "Thanos"}
      ]
    },
    {
      "id": 2,
      "titulo": "Parasita",
      "descricao": "Uma família pobre se infiltra na vida de uma família rica, com consequências inesperadas.",
      "genero": "Drama, Suspense, Comédia",
      "diretor": "Bong Joon-ho",
      "atores": ["Song Kang-ho", "Choi Woo-shik", "Park So-dam"],
      "destaque": false,
      "ano": 2019,
      "imagem_principal": "https://via.placeholder.com/300x450",
      "imagens_complementares": [
        {"id": 1, "src": "https://via.placeholder.com/150x100", "descricao": "Família Kim"},
        {"id": 2, "src": "https://via.placeholder.com/150x100", "descricao": "Casa dos Park"},
        {"id": 3, "src": "https://via.placeholder.com/150x100", "descricao": "Intrusão"}
      ]
    },
    {
      "id": 3,
      "titulo": "Interestelar",
      "descricao": "Um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.",
      "genero": "Ficção Científica, Aventura, Drama",
      "diretor": "Christopher Nolan",
      "atores": ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      "destaque": true,
      "ano": 2014,
      "imagem_principal": "https://via.placeholder.com/300x450",
      "imagens_complementares": [
        {"id": 1, "src": "https://via.placeholder.com/150x100", "descricao": "Nave espacial"},
        {"id": 2, "src": "https://via.placeholder.com/150x100", "descricao": "Planeta alienígena"},
        {"id": 3, "src": "https://via.placeholder.com/150x100", "descricao": "Buraco negro"}
      ]
    },
    {
      "id": 4,
      "titulo": "Mad Max: Estrada da Fúria",
      "descricao": "Em um futuro pós-apocalíptico, uma mulher se rebela contra um tirano em busca de sua terra natal.",
      "genero": "Ação, Aventura, Ficção Científica",
      "diretor": "George Miller",
      "atores": ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
      "destaque": false,
      "ano": 2015,
      "imagem_principal": "https://via.placeholder.com/300x450",
      "imagens_complementares": [
        {"id": 1, "src": "https://via.placeholder.com/150x100", "descricao": "Perseguição"},
        {"id": 2, "src": "https://via.placeholder.com/150x100", "descricao": "Veículos"},
        {"id": 3, "src": "https://via.placeholder.com/150x100", "descricao": "Tempestade de areia"}
      ]
    },
    {
      "id": 5,
      "titulo": "A Chegada",
      "descricao": "Uma linguista tenta se comunicar com alienígenas que chegam à Terra, buscando entender suas intenções.",
      "genero": "Ficção Científica, Drama, Mistério",
      "diretor": "Denis Villeneuve",
      "atores": ["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
      "destaque": true,
      "ano": 2016,
      "imagem_principal": "https://via.placeholder.com/300x450",
      "imagens_complementares": [
        {"id": 1, "src": "https://via.placeholder.com/150x100", "descricao": "Nave alienígena"},
        {"id": 2, "src": "https://via.placeholder.com/150x100", "descricao": "Linguista"},
        {"id": 3, "src": "https://via.placeholder.com/150x100", "descricao": "Comunicação"}
      ]
    },
    {
      "id": 6,
      "titulo": "O Poderoso Chefão",
      "descricao": "A saga da família Corleone e sua influência no mundo do crime organizado.",
      "genero": "Drama, Crime",
      "diretor": "Francis Ford Coppola",
      "atores": ["Marlon Brando", "Al Pacino", "James Caan"],
      "destaque": false,
      "ano": 1972,
      "imagem_principal": "https://via.placeholder.com/300x450",
      "imagens_complementares": [
        {"id": 1, "src": "https://via.placeholder.com/150x100", "descricao": "Don Corleone"},
        {"id": 2, "src": "https://via.placeholder.com/150x100", "descricao": "Reunião da família"},
        {"id": 3, "src": "https://via.placeholder.com/150x100", "descricao": "Cena clássica"}
      ]
    }
  ]
};

function getFilmesDestaque() {
  return dados.filmes.filter(filme => filme.destaque);
}

function getTodosFilmes() {
  return dados.filmes;
}

function getFilmePorId(id) {
  return dados.filmes.find(filme => filme.id === parseInt(id));
}