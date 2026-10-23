/**
 * fix_reviews.js
 * Substitui "Anônimo" por nomes brasileiros reais e preenche
 * comentários vazios com avaliações relevantes ao produto.
 */
const fs = require('fs');
const path = require('path');

// =============================================
// BANCO DE NOMES BRASILEIROS
// =============================================
const NOMES = [
  'Ana Paula S.', 'Carlos Eduardo M.', 'Fernanda Lima', 'Roberto Alves',
  'Juliana Costa', 'Marcos Pereira', 'Patrícia Souza', 'Ricardo Nunes',
  'Camila Ferreira', 'Diego Martins', 'Luciana Rocha', 'Felipe Gomes',
  'Tatiana Oliveira', 'Anderson Silva', 'Beatriz Santos', 'Thiago Carvalho',
  'Vanessa Ramos', 'Leandro Freitas', 'Priscila Mendes', 'Rodrigo Nascimento',
  'Aline Vieira', 'Eduardo Barros', 'Simone Cardoso', 'Gustavo Lima',
  'Renata Pinto', 'Fábio Correia', 'Cristina Lopes', 'Alexandre Moreira',
  'Débora Araújo', 'Vinícius Ribeiro', 'Mariana Torres', 'Bruno Cavalcante',
  'Larissa Fernandes', 'Samuel Batista', 'Kátia Rodrigues', 'Henrique Castro',
  'Isabela Teixeira', 'William Moura', 'Elaine Fonseca', 'Gabriel Prado',
  'Andréia Borges', 'Leonardo Cunha', 'Natália Azevedo', 'Daniel Monteiro',
  'Suélen Machado', 'Otávio Gomes', 'Tatiele Campos', 'Mateus Xavier',
  'Rosana Dias', 'Igor Medeiros', 'Jaqueline Neves', 'Cauã Duarte',
  'Rafaela Coelho', 'Wendel Braga', 'Miriam Andrade', 'Murilo Cardoso',
  'Giovana Reis', 'Cristiano Sousa', 'Adriana Lima', 'Pablo Siqueira',
  'Cintia Barbosa', 'Jonas Figueiredo', 'Nathalia Guimarães', 'Augusto Melo'
];

// =============================================
// COMENTÁRIOS POR PALAVRAS-CHAVE DO PRODUTO
// =============================================
const COMENTARIOS_POR_TEMA = {
  // Fitness / Academia / Bicicleta
  'bicicleta|spinning|ergometrica|fitness|academia|exercicio': [
    'Produto excelente! Montagem fácil e já comecei meu treino no mesmo dia. Vale muito a pena!',
    'Comprei para usar em casa e estou adorando. Suporta bem meu peso e é silenciosa.',
    'Muito boa qualidade, o resistor funciona perfeitamente. Recomendo demais!',
    'Chegou bem embalada e rápido. Meu marido montou em 40 minutos. Estamos satisfeitos!',
    'Produto de ótima qualidade. Uso todos os dias e não apresentou nenhum problema.',
    'Superou minhas expectativas! Bem construída e confortável para pedalar por horas.',
  ],
  // Caixa de Som / Áudio / Speaker
  'caixa|som|speaker|bluetooth|audio|falante|aiwa|boombox': [
    'Som incrível para o tamanho! Grave muito bom, conecta fácil no celular.',
    'Comprei para usar na praia e foi perfeita. Resistente e o som enche o ambiente.',
    'Excelente qualidade de som! Bateria dura muito e o pareamento é instantâneo.',
    'Chegou antes do prazo. O grave é poderoso e o som limpo. Adorei!',
    'Produto muito bom, som alto e sem distorção mesmo no volume máximo. Top!',
    'Conectividade perfeita, design bonito e som que impressiona qualquer um. 5 estrelas!',
  ],
  // Celular / Smartphone / iPhone
  'celular|smartphone|iphone|samsung|redmi|xiaomi|tela': [
    'Aparelho chegou perfeito, tela linda e câmera incrível. Muito satisfeita!',
    'Entrega rápida, produto em perfeito estado. A bateria dura o dia todo.',
    'Excelente custo-benefício! Roda todos os apps sem travar. Super recomendo.',
    'Produto original e com nota fiscal. Câmera tirou fotos incríveis desde o primeiro dia.',
    'Tela maravilhosa e desempenho ótimo. Chegou bem embalado e antecipado.',
  ],
  // Tênis / Calçado / Sapato
  'tenis|sapato|calcado|chuteira|sandalia|chinelo': [
    'Produto de ótima qualidade! Muito confortável e o material é resistente.',
    'Chegou exatamente como na foto. Caimento perfeito no pé. Amei!',
    'Super confortável para usar o dia todo. Valeu muito cada centavo!',
    'Material de qualidade, costura firme e design bonito. Recomendo!',
    'Chegou antes do prazo e dentro de uma embalagem segura. Adorei o produto!',
  ],
  // Camiseta / Roupa / Vestuário
  'camiseta|camisa|roupa|blusa|vestido|calca|shorts|moletom': [
    'Tecido de ótima qualidade e caimento perfeito. A cor ficou idêntica à foto!',
    'Material confortável e lavou fácil. Chegou bem embalada. Muito satisfeita!',
    'A estampa ficou linda e o tamanho foi certinho. Recomendo muito a loja!',
    'Produto bem acabado, costura firme e sem defeitos. Aprovadíssimo!',
    'Muito confortável para o dia a dia. Já fiz a segunda compra na loja!',
  ],
  // Fone / Headphone / Earphone
  'fone|headphone|earphone|auricular|earbuds|tws': [
    'Som de altíssima qualidade! Cancelamento de ruído incrível para o preço.',
    'Confortável de usar por horas, encaixa perfeitamente no ouvido. Top!',
    'Bateria dura muito e a conexão bluetooth é estável. Recomendo demais!',
    'Chegou antes do prazo, embalagem perfeita e produto original. 5 estrelas!',
    'Excelente para academia e trabalho. Qualidade de som que surpreende!',
  ],
  // Relogio / Smartwatch
  'relogio|smartwatch|watch|pulso': [
    'Lindo e funcional! As notificações chegam rápido e a tela é nítida.',
    'Bateria dura dias e o monitor cardíaco é preciso. Adorei a compra!',
    'Produto de ótima qualidade! Design elegante e recursos incríveis.',
    'Chegou perfeito, exatamente como na foto. Estou usando todo dia!',
    'Muito bom para acompanhar meus treinos. Recomendo muito!',
  ],
  // Perfume / Cosmético / Beleza
  'perfume|fragancia|cosmetico|maquiagem|creme|serum|beauty': [
    'Fragrância maravilhosa e duradoura! Recebi muitos elogios já no primeiro dia.',
    'Produto original e com ótima fixação. Vale muito pelo preço!',
    'Chegou bem embalado e dentro do prazo. Cheiro incrível, amei!',
    'Exatamente igual ao descrito. A fixação dura o dia todo. Recomendo!',
  ],
  // Eletrodoméstico / Aspirador / Limpa
  'aspirador|extratora|higienizadora|limpeza|vassoura|robô': [
    'Produto incrível! Tirou manchas que achei que nunca sairiam do sofá.',
    'Sucção poderosa e fácil de usar. Limpou meu colchão muito bem!',
    'Chegou antes do prazo e funcionou desde o primeiro uso. Recomendo!',
    'Melhor compra que fiz! Uso em sofá, carro e colchão. Excelente!',
    'Motor potente e silencioso. Valeu muito pelo preço!',
  ],
  // Câmera / Foto / Vídeo
  'camera|foto|video|filmagem|gopro|action': [
    'Qualidade de imagem incrível! Fotos nítidas mesmo em ambientes escuros.',
    'Produto excelente! Estabilização de imagem muito boa e bateria dura bastante.',
    'Comprei para viagem e ficou perfeito. Fotos e vídeos lindíssimos!',
    'Fácil de usar e imagem de qualidade profissional. Super recomendo!',
  ],
  // Genérico / Outros
  'default': [
    'Produto excelente! Chegou antes do prazo e bem embalado. Recomendo muito!',
    'Superou as expectativas. Qualidade muito boa e entrega rápida. 5 estrelas!',
    'Compra muito satisfatória. O produto é idêntico às fotos e de ótima qualidade.',
    'Atendimento impecável e produto de qualidade. Já indiquei para amigos!',
    'Chegou perfeito, sem avarias. Qualidade excelente pelo preço. Recomendo!',
    'Produto muito bom! Compra segura, entrega rápida. Voltarei a comprar.',
    'Excelente custo-benefício. Produto de qualidade superior ao esperado!',
    'Fiquei muito satisfeito com a compra. Produto original e bem embalado.',
    'Entrega antecipada e produto em perfeito estado. Super recomendo a loja!',
    'Material de qualidade, acabamento perfeito. Atendeu totalmente as expectativas.',
    'Produto chegou como descrito. Ótima qualidade e embalagem bem protegida.',
    'Muito bom mesmo! Comprei por indicação de amigo e não me arrependi.',
    'Funciona perfeitamente desde o primeiro uso. Compra garantida, recomendo!',
    'Valeu cada centavo! Produto de alta qualidade e loja muito confiável.',
    'Compra muito boa. O produto é exatamente o que estava procurando!',
  ]
};

// =============================================
// FUNÇÕES AUXILIARES
// =============================================
let nomeIndex = 0;
function proximoNome() {
  const nome = NOMES[nomeIndex % NOMES.length];
  nomeIndex++;
  return nome;
}

function getComentario(nomeArquivo, indice) {
  // Determinar tema pelo nome do arquivo (ou por contexto se tivéssemos o título)
  const arquivo = nomeArquivo.toLowerCase();
  
  for (const [pattern, comentarios] of Object.entries(COMENTARIOS_POR_TEMA)) {
    if (pattern === 'default') continue;
    const regex = new RegExp(pattern, 'i');
    if (regex.test(arquivo)) {
      return comentarios[indice % comentarios.length];
    }
  }
  
  // Genérico
  const defaults = COMENTARIOS_POR_TEMA['default'];
  return defaults[indice % defaults.length];
}

// =============================================
// PROCESSAR TODOS OS ARQUIVOS DE PRODUTO
// =============================================
const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

let totalAnonimosSubstituidos = 0;
let totalComentariosAdicionados = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  let mudouArquivo = false;
  
  // ---- 1. Substituir "Anônimo" por nomes reais ----
  const anonPattern = />Anônimo</g;
  const contaAnonimos = (html.match(anonPattern) || []).length;
  
  if (contaAnonimos > 0) {
    let localNomeIdx = 0;
    html = html.replace(/>Anônimo</g, () => {
      const nome = proximoNome();
      localNomeIdx++;
      return `>${nome}<`;
    });
    totalAnonimosSubstituidos += contaAnonimos;
    mudouArquivo = true;
    console.log(`  ${file}: ${contaAnonimos} "Anônimo" → nomes reais`);
  }
  
  // ---- 2. Preencher comentários vazios (review-comment vazio) ----
  // Detectar padrão: class="review-comment"> seguido de espaço/nova linha e </div>
  const emptyCommentPattern = /(<div class="review-comment">)\s*(<\/div>)/g;
  const contaVazios = (html.match(emptyCommentPattern) || []).length;
  
  if (contaVazios > 0) {
    let localComIdx = 0;
    html = html.replace(emptyCommentPattern, (match, openTag, closeTag) => {
      const comentario = getComentario(file, localComIdx++);
      totalComentariosAdicionados++;
      return `${openTag}${comentario}${closeTag}`;
    });
    mudouArquivo = true;
    console.log(`  ${file}: ${contaVazios} comentários vazios preenchidos`);
  }
  
  if (mudouArquivo) {
    fs.writeFileSync(filePath, html, 'utf8');
  }
}

console.log('\n========================================');
console.log(`✔ Total de "Anônimo" substituídos: ${totalAnonimosSubstituidos}`);
console.log(`✔ Total de comentários preenchidos: ${totalComentariosAdicionados}`);
console.log(`✔ Arquivos processados: ${files.length}`);
console.log('========================================');
