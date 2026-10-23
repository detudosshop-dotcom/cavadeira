const fs = require('fs');
const path = require('path');

// Nomes Brasileiros separados por gênero
const NOMES_MASCULINOS = [
  'Carlos Eduardo', 'Roberto Alves', 'Marcos Pereira', 'Ricardo Nunes', 'Diego Martins', 
  'Felipe Gomes', 'Anderson Silva', 'Thiago Carvalho', 'Leandro Freitas', 'Rodrigo Nascimento', 
  'Eduardo Barros', 'Gustavo Lima', 'Fábio Correia', 'Alexandre Moreira', 'Vinícius Ribeiro', 
  'Bruno Cavalcante', 'Samuel Batista', 'Henrique Castro', 'William Moura', 'Gabriel Prado', 
  'Leonardo Cunha', 'Daniel Monteiro', 'Otávio Gomes', 'Mateus Xavier', 'Igor Medeiros', 
  'Cauã Duarte', 'Wendel Braga', 'Murilo Cardoso', 'Cristiano Sousa', 'Pablo Siqueira', 
  'Jonas Figueiredo', 'Augusto Melo', 'Renato Souza', 'Matheus Costa', 'Lucas Oliveira', 
  'Arthur Santos', 'Felipe Almeida', 'Guilherme Silva', 'Pedro Rocha', 'Rafael Barbosa'
];

const NOMES_FEMININOS = [
  'Ana Paula', 'Fernanda Lima', 'Juliana Costa', 'Patrícia Souza', 'Camila Ferreira', 
  'Luciana Rocha', 'Tatiana Oliveira', 'Beatriz Santos', 'Vanessa Ramos', 'Priscila Mendes', 
  'Aline Vieira', 'Simone Cardoso', 'Renata Pinto', 'Cristina Lopes', 'Débora Araújo', 
  'Mariana Torres', 'Larissa Fernandes', 'Kátia Rodrigues', 'Isabela Teixeira', 'Elaine Fonseca', 
  'Andréia Borges', 'Natália Azevedo', 'Suélen Machado', 'Tatiele Campos', 'Rosana Dias', 
  'Jaqueline Neves', 'Rafaela Coelho', 'Miriam Andrade', 'Giovana Reis', 'Adriana Lima', 
  'Cintia Barbosa', 'Nathalia Guimarães', 'Letícia Castro', 'Amanda Martins', 'Camila Dias', 
  'Bárbara Mendes', 'Juliana Rezende', 'Carolina Vieira', 'Júlia Nogueira', 'Gabriela Ribeiro'
];

const COMENTARIOS_GERAIS = [
  "Qualidade fantástica do tecido, superou muito minhas expectativas.",
  "As duas camisas vieram perfeitas, tamanho bate com a tabela de medidas.",
  "Melhor custo benefício que encontrei na internet. Tecido super gostoso e fresco.",
  "Muito top! Comprei pro meu marido e serviu certinho o tamanho G.",
  "Comprei o kit misto e chegou super rápido. Acabamento de primeira.",
  "Estou muito satisfeito. As costuras são muito bem feitas, brasão impecável.",
  "Excelente qualidade, tecido confortável pro dia a dia.",
  "Comprei pro meu filho e ele não tira mais do corpo kkkk muito bom!",
  "Material de primeira, as cores são vivas e idênticas ao anúncio. Recomendo.",
  "Super indico! O atendimento tirou minhas dúvidas de personalização no WhatsApp e deu tudo certo.",
  "Chegou tudo conforme o combinado, recomendo muito esse kit.",
  "Muito bem embalado, entrega no prazo e produto excelente.",
  "Sensacional a qualidade das camisas, tecido muito leve.",
  "Uso pra treinar e jogar bola, aguenta muito bem a lavagem e não desbota.",
  "Adorei as camisetas, caimento impecável no corpo.",
  "Comprei de presente pro meu namorado e ele amou o tecido e o escudo.",
  "Ótima experiência de compra, voltarei a comprar com certeza.",
  "Muito confortável, material de excelente qualidade.",
  "Simplesmente perfeito! As costuras e decalques são muito fiéis.",
  "Chegou antes do prazo! As duas camisas vieram exatamente nas cores escolhidas.",
  "Muito satisfeito com o kit, qualidade nota 10.",
  "Personalizei com nome e número e ficou profissional demais.",
  "Caimento excelente, comprei tamanho M e ficou na medida certa.",
  "Preço ótimo pelo que oferece, o tecido é bem fresco.",
  "Produto original e de excelente bom gosto. Muito bom mesmo.",
  "Minhas duas camisas chegaram bem rápidas. Material premium.",
  "Muito confortável e resistente, vale muito cada centavo.",
  "Ótima aquisição! A branca reserva é linda demais de perto.",
  "Nota 10 para o envio e qualidade, muito rápido.",
  "Comprei o kit com as duas vermelhas e são maravilhosas."
];

// Carregar imagens das pastas
const FOTOS_PERFIL = fs.readdirSync("FOTOSDEPERFIL").filter(f => f.toLowerCase().endsWith(".jpeg") || f.toLowerCase().endsWith(".png"));
const FOTOS_AVAL = fs.readdirSync("AVALIACOESFOTOS").filter(f => f.toLowerCase().endsWith(".jpeg") || f.toLowerCase().endsWith(".png"));

console.log(`Carregando ${FOTOS_PERFIL.length} fotos de perfil e ${FOTOS_AVAL.length} fotos de avaliações.`);

// Criar 120 avaliações ricas
const avaliacoes = [];

// Mapeamento manual das avaliações ricas com fotos baseadas nas 5 principais
// Vamos primeiro criar as avaliações estruturadas com cenários unificados e fotos correspondentes.
// Thiago (3 fotos de camisas unificadas)
avaliacoes.push({
  nome: 'thiago_portugal',
  avatar: `../FOTOSDEPERFIL/WhatsApp Image 2026-06-29 at 23.31.11.jpeg`,
  comentario: 'Muito top! Chegaram as duas certinhas, o tecido da Puma é sensacional e muito fresco pro calor. Recomendo demais o kit.',
  nota: 5,
  data: '2026-06-25 14:22',
  variacao: 'L',
  fotos: [
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.51.jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.51 (1).jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.51 (2).jpeg'
  ]
});

// Nuno (3 fotos de camisas unificadas)
avaliacoes.push({
  nome: 'nuno_r',
  avatar: `../FOTOSDEPERFIL/WhatsApp Image 2026-06-29 at 23.31.12.jpeg`,
  comentario: 'Excelente custo-benefício. Levar os dois uniformes por esse preço é imbatível. A costura e os escudos estão impecáveis.',
  nota: 5,
  data: '2026-06-24 09:15',
  variacao: 'M',
  fotos: [
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.52.jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.52 (1).jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.52 (2).jpeg'
  ]
});

// Joao (3 fotos de camisas unificadas)
avaliacoes.push({
  nome: 'joao_silva',
  avatar: `../FOTOSDEPERFIL/WhatsApp Image 2026-06-29 at 23.31.13.jpeg`,
  comentario: 'Camisas maravilhosas. Serviram direitinho o tamanho XL. Produto original e a entrega foi super rápida, chegou em 3 dias.',
  nota: 5,
  data: '2026-06-20 18:30',
  variacao: 'XL',
  fotos: [
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.55.jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.55 (1).jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.55 (2).jpeg'
  ]
});

// Gabriel (3 fotos de camisas unificadas)
avaliacoes.push({
  nome: 'gabriel_ferreira',
  avatar: `../FOTOSDEPERFIL/WhatsApp Image 2026-06-29 at 23.31.14.jpeg`,
  comentario: 'Qualidade absurda do tecido. A vermelha titular e a branca reserva são lindas demais de perto. Compra garantida!',
  nota: 5,
  data: '2026-06-18 11:10',
  variacao: 'L',
  fotos: [
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.56.jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.56 (1).jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.56 (2).jpeg'
  ]
});

// Beatriz (2 fotos de camisas unificadas - Gênero Feminino!)
avaliacoes.push({
  nome: 'beatriz_m',
  avatar: `../FOTOSDEPERFIL/WhatsApp Image 2026-06-29 at 23.31.15.jpeg`,
  comentario: 'Comprei pro meu filho e ele adorou. Coube perfeitamente o tamanho P. Chegou bem embalado.',
  nota: 5,
  data: '2026-06-15 15:40',
  variacao: 'S',
  fotos: [
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.57.jpeg',
    '../AVALIACOESFOTOS/WhatsApp Image 2026-06-29 at 23.12.57 (1).jpeg'
  ]
});

// Vamos criar as outras fotos de avaliações que restaram de AVALIACOESFOTOS
// Agrupando-as e distribuindo entre perfis masculinos ou femininos correspondentes de FOTOSDEPERFIL.
let avalFotoIndex = 3; // WhatsApp Image 2026-06-29 at 23.12.51 (3)
let perfilIndex = 5; // A partir do 5

const formatNameForUser = (name) => {
  return name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 90 + 10);
};

const getRandomDate = () => {
  const day = Math.floor(Math.random() * 25 + 1).toString().padStart(2, '0');
  const hour = Math.floor(Math.random() * 14 + 8).toString().padStart(2, '0');
  const min = Math.floor(Math.random() * 50 + 10).toString().padStart(2, '0');
  return `2026-06-${day} ${hour}:${min}`;
};

const getRandomSize = () => {
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

// Gerar avaliações com as imagens restantes de AVALIACOESFOTOS
while (perfilIndex < FOTOS_PERFIL.length && avalFotoIndex < FOTOS_AVAL.length) {
  const perfilImg = FOTOS_PERFIL[perfilIndex];
  // Determinar se o perfil é masculino ou feminino com base nas fotos enviadas
  // Para evitar erros, podemos usar nomes neutros ou sortear da lista que bate com a imagem.
  // Como são fotos reais, distribuiremos de forma intercalada de forma que os avatares batam com nomes corretos.
  const isFemale = perfilIndex % 2 === 0;
  const nameBase = isFemale 
    ? NOMES_FEMININOS[perfilIndex % NOMES_FEMININOS.length] 
    : NOMES_MASCULINOS[perfilIndex % NOMES_MASCULINOS.length];

  const username = formatNameForUser(nameBase);
  const text = COMENTARIOS_GERAIS[perfilIndex % COMENTARIOS_GERAIS.length];

  // Agrupa de 1 a 2 fotos por avaliação
  const fotosAnexas = [];
  const qty = Math.floor(Math.random() * 2) + 1;
  for (let q = 0; q < qty; q++) {
    if (avalFotoIndex < FOTOS_AVAL.length) {
      fotosAnexas.push(`../AVALIACOESFOTOS/${FOTOS_AVAL[avalFotoIndex]}`);
      avalFotoIndex++;
    }
  }

  avaliacoes.push({
    nome: username,
    avatar: `../FOTOSDEPERFIL/${perfilImg}`,
    comentario: text,
    nota: 5,
    data: getRandomDate(),
    variacao: getRandomSize(),
    fotos: fotosAnexas
  });

  perfilIndex++;
}

// Para completar até ~120, geramos avaliações puramente de texto com avatares e nomes humanizados
// Usando as fotos de perfil restantes e letras iniciais/placeholders nos demais
while (avaliacoes.length < 120) {
  const isFemale = avaliacoes.length % 2 === 0;
  const nameBase = isFemale 
    ? NOMES_FEMININOS[Math.floor(Math.random() * NOMES_FEMININOS.length)]
    : NOMES_MASCULINOS[Math.floor(Math.random() * NOMES_MASCULINOS.length)];
  
  const username = formatNameForUser(nameBase);
  const text = COMENTARIOS_GERAIS[Math.floor(Math.random() * COMENTARIOS_GERAIS.length)];
  
  let avatarHtml = '';
  // Se ainda tivermos fotos de perfil não utilizadas
  if (perfilIndex < FOTOS_PERFIL.length) {
    avatarHtml = `<img src="../FOTOSDEPERFIL/${FOTOS_PERFIL[perfilIndex]}" alt="${username}" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;">`;
    perfilIndex++;
  } else {
    // Placeholder com a letra
    const letter = nameBase.charAt(0).toUpperCase();
    avatarHtml = `<div class="review-avatar-placeholder">${letter}</div>`;
  }

  avaliacoes.push({
    nome: username,
    avatarHtml: avatarHtml,
    comentario: text,
    nota: Math.random() > 0.1 ? 5 : 4,
    data: getRandomDate(),
    variacao: getRandomSize(),
    fotos: []
  });
}

// Ordenar as avaliações por data decrescente para parecer real
avaliacoes.sort((a, b) => new Date(b.data.replace(' ', 'T')) - new Date(a.data.replace(' ', 'T')));

// Montar o HTML final
let reviewsHtml = '';
avaliacoes.forEach(r => {
  const stars = '⭐'.repeat(r.nota);
  let avatarMarkup = r.avatarHtml || `<img src="${r.avatar}" alt="${r.nome}" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;">`;
  
  let photosMarkup = '';
  if (r.fotos && r.fotos.length > 0) {
    photosMarkup = `\n          <div class="review-photos" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">`;
    r.fotos.forEach(f => {
      photosMarkup += `\n            <img src="${f}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; cursor: pointer;" onclick="openPhotoModal(this.src)">`;
    });
    photosMarkup += `\n          </div>`;
  }

  reviewsHtml += `
        <div class="review-card">
          <div class="review-header">
            <div class="review-user">
              <div class="review-avatar">${avatarMarkup}</div>
              <div class="review-user-info">
                <div class="review-user-name">${r.nome}</div>
                <div class="review-user-stars">${stars}</div>
                <div class="review-date">${r.data} | Variação: ${r.variacao}</div>
              </div>
            </div>
          </div>
          <p class="review-comment">${r.comentario}</p>${photosMarkup}
        </div>`;
});

// Ler produto-99.html e substituir a seção de avaliações inteira
const filePath = 'pages/produto-99.html';
let html = fs.readFileSync(filePath, 'utf8');

const reviewsSectionRegex = /<!-- AVALIAÇÕES -->[\s\S]*?<div class="reviews-section">[\s\S]*?<h3 class="reviews-header">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

// Vamos buscar com precisão o bloco do container das avaliações
const startKey = '<!-- AVALIAÇÕES -->';
const endKey = '<!-- PRODUTOS RELACIONADOS -->';

const startIdx = html.indexOf(startKey);
const endIdx = html.indexOf(endKey);

if (startIdx !== -1 && endIdx !== -1) {
  const prefix = html.substring(0, startIdx);
  const suffix = html.substring(endIdx);
  
  const finalSection = `<!-- AVALIAÇÕES -->
      <div class="reviews-section">
        <h3 class="reviews-header">Avaliações dos clientes (120)</h3>
        <div class="reviews-summary">
          <span class="review-avg">4.9</span><span class="review-avg-total">/5</span>
          <div class="review-stars">
            ${'⭐'.repeat(5)}
          </div>
        </div>
        ${reviewsHtml}
      </div>
      
      `;
      
  fs.writeFileSync(filePath, prefix + finalSection + suffix, 'utf8');
  console.log("Sucesso! 120 avaliações ricas integradas no produto-99.html");
} else {
  console.log("Erro ao encontrar delimitadores de avaliações no html.");
}
