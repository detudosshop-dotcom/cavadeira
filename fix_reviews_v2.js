/**
 * fix_reviews_v2.js
 * Expande comentários muito curtos (menos de 20 chars) com avaliações completas
 * usando o nome/título do produto como contexto
 */
const fs = require('fs');
const path = require('path');

// Banco de avaliações completas por tema
const COMENTARIOS = {
  'caixa|som|speaker|bluetooth|audio|falante|aiwa|boombox|caixinha': [
    'Produto incrível! O som é poderoso, o grave é perfeito e não distorce nem no volume máximo. Conecta via bluetooth de forma instantânea e a bateria dura muito. Compra certíssima!',
    'Superou todas as expectativas! A qualidade do som é impressionante para o tamanho. Usei na festa e todo mundo ficou admirado. Vale cada centavo!',
    'Comprei com receio por ser online, mas chegou muito bem embalada e o som é espetacular! Muito melhor que caixas que vi em loja por preço maior.',
    'Excelente para qualidade do produto! Som nítido, grave encorpado e bluetooth estável. A resistência à agua é ótima. Recomendo para todos!',
    'Linda e funcional! A caixa de som tem um design elegante e o som envolve o ambiente inteiro. Minha família adorou. Com certeza voltarei a comprar!',
    'Produto de qualidade premium! O som é muito alto e limpo. A conectividade bluetooth é instantânea e não trava. Estou muito feliz com a compra!',
  ],
  'bicicleta|spinning|ergometrica|fitness|academia|exercicio|pedal': [
    'Excelente bicicleta! Montagem foi tranquila e já estou usando todos os dias. O resistor funciona perfeitamente e é bem silenciosa. Suporta meu peso sem problema. Super recomendo!',
    'Produto de ótima qualidade e entrega rápida! A bicicleta é robusta, fácil de montar e o nível de resistência varia bem. Estou adorando meus treinos em casa!',
    'Comprei para fazer exercício em casa e estou muito satisfeita. O banco é confortável, o guidão regulável e a estrutura é bem firme. Vale muito o investimento!',
    'Incrível custo-benefício! A bicicleta é bem construída, estável e funciona perfeitamente. Meu marido montou em menos de uma hora. Estamos usando todo dia!',
  ],
  'tenis|sapato|calcado|chuteira|sandalia|chinelo|calçado': [
    'Produto de qualidade! O material é resistente, o caimento é perfeito e o conforto é ótimo. Chegou muito bem embalado e idêntico às fotos. Comprei para minha filha e ela adorou!',
    'Amei demais! O tênis ficou lindo e é muito confortável para usar o dia todo. A numeração estava certa e o material é de primeira qualidade. Recomendo muito essa loja!',
    'Excelente! Produto tal como descrito, chegou antes do prazo e a qualidade é superior. Já usei em academia e não machucou o pé. Voltarei a comprar com certeza!',
    'Muito satisfeita com a compra! O calçado é de ótima qualidade, o tecido é resistente e o design é lindo. Recebi vários elogios quando usei. Super recomendo!',
  ],
  'camiseta|camisa|roupa|blusa|vestido|calca|shorts|moletom|moda': [
    'Produto excelente! O tecido é muito macio e confortável, a estampa ficou linda e as cores são idênticas às fotos. Tamanho perfeito para mim. Já fiz mais pedidos na loja!',
    'Amei muito! A qualidade do tecido é ótima, a costura é firme e o acabamento é impecável. Lavei várias vezes e continua perfeito. Compra garantida!',
    'Superou minhas expectativas! A roupa é confortável, bem acabada e o caimento ficou lindo. Chegou antes do prazo e bem embalada. Recomendo muito essa loja!',
    'Produto de qualidade! O material é durável, a estampa não desbotou e o conforto é ótimo para o dia a dia. Meu filho adorou! Voltarei a comprar.',
  ],
  'fone|headphone|earphone|auricular|earbuds|tws|ouvido': [
    'Produto incrível! A qualidade do som é excepcional, o cancelamento de ruído funciona muito bem e a bateria dura horas. Confortável para usar por longos períodos. Recomendo!',
    'Excelente compra! Os fones chegaram na embalagem original, o som é nítido e o pareamento bluetooth é instantâneo. Uso no trabalho e na academia. Super recomendo!',
    'Muito satisfeito! A qualidade do áudio é surpreendente para o preço. O grave é bem definido e os médios são nítidos. Confortável e com ótima autonomia de bateria.',
    'Comprei para presentear e ficou perfeito! O fone é bonito, confortável e o som é de alta qualidade. A pessoa amou o presente. Voltarei a comprar com certeza!',
  ],
  'relogio|smartwatch|watch|pulso|smart': [
    'Excelente smartwatch! As notificações chegam na hora, o monitor cardíaco é preciso e o design é muito elegante. Bateria dura vários dias. Super recomendo!',
    'Produto incrível pelo preço! A tela é bonita, os recursos são completos e a pulseira é confortável. Uso para monitorar meus treinos e adorei. Recomendo muito!',
    'Comprei para monitorar minha saúde e estou adorando! Conta passos, bpm, sono... tudo funcionando perfeitamente. Design lindo e qualidade excelente. Vale cada centavo!',
  ],
  'perfume|fragancia|cosmetico|maquiagem|creme|serum|beleza': [
    'Produto maravilhoso! A fragrância é incrível e de longa duração. Recebi vários elogios desde o primeiro dia que usei. Chegou bem embalado e original. Super recomendo!',
    'Amei demais! O produto é de alta qualidade, a fixação é excelente e o cheiro é lindo. Chegou antes do prazo e em perfeito estado. Já indiquei para amigas!',
    'Excelente qualidade! O produto funciona muito bem, a textura é ótima e o resultado é visível rápido. Estou muito satisfeita com a compra. Voltarei a comprar!',
  ],
  'aspirador|extratora|higienizadora|limpeza|vassoura': [
    'Produto incrível! Tirou manchas do meu sofá que eu achei que nunca sairiam. A sucção é muito poderosa e é fácil de usar. Resultado impecável. Super recomendo!',
    'Excelente produto! Limpei meu colchão, sofá e estofados do carro. O resultado foi surpreendente! Chegou bem embalado e funcionando perfeitamente. Adorei!',
    'Muito satisfeita com a compra! O produto tem boa potência, é prático de usar e faz a limpeza muito bem. Recomendo para qualquer um que queira higienizar casa.',
  ],
  'default': [
    'Produto excelente! Chegou antes do prazo e bem embalado. A qualidade é muito superior ao esperado. Estou completamente satisfeito com a compra. Recomendo demais!',
    'Superou todas as expectativas! Produto idêntico às fotos, com acabamento impecável e ótima qualidade. A entrega foi rápida e o atendimento foi perfeito. 5 estrelas!',
    'Compra muito satisfatória! O produto chegou em perfeito estado, funcionando desde o primeiro uso e a qualidade é excelente. Já indiquei para amigos e familiares!',
    'Produto de altíssima qualidade! Vale muito pelo preço. Chegou bem embalado, sem nenhum dano. Estou usando todo dia e não tive nenhum problema. Recomendo muito!',
    'Excelente custo-benefício! Produto de qualidade profissional por um preço justo. A entrega foi rápida e o produto veio com tudo funcionando. Voltarei a comprar!',
    'Muito satisfeito com essa compra! O produto é de ótima qualidade, fácil de usar e duradouro. A loja é muito confiável e a entrega foi rápida. Super recomendo!',
    'Produto incrível! Não esperava tamanha qualidade pelo preço. Chegou em perfeito estado e já está em uso. Minha família adorou. Certamente voltarei a comprar!',
    'Comprei com um pouco de receio mas me surpreendi muito positivamente! Qualidade excepcional, entrega rápida e embalagem segura. 100% satisfeita com a compra!',
  ]
};

function getExpansion(filename, shortText, idx) {
  const fname = filename.toLowerCase();
  
  for (const [pattern, comentarios] of Object.entries(COMENTARIOS)) {
    if (pattern === 'default') continue;
    if (new RegExp(pattern, 'i').test(fname)) {
      return comentarios[idx % comentarios.length];
    }
  }
  
  // Tenta inferir pelo texto curto existente
  const txt = shortText.toLowerCase();
  if (/caixa|som|audio/.test(txt)) return COMENTARIOS['caixa|som|speaker|bluetooth|audio|falante|aiwa|boombox|caixinha'][idx % 6];
  
  const defaults = COMENTARIOS['default'];
  return defaults[idx % defaults.length];
}

// Processar todos os produtos
const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

let totalCorrigidos = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let mudou = false;
  let localIdx = 0;
  
  // Encontrar comentários curtos (dentro de <div class="review-comment">...</div>)
  // Usando abordagem manual para maior controle
  const OPEN = 'class="review-comment">';
  const CLOSE = '</div>';
  
  let result = '';
  let pos = 0;
  
  while (pos < html.length) {
    const openIdx = html.indexOf(OPEN, pos);
    if (openIdx < 0) {
      result += html.slice(pos);
      break;
    }
    
    result += html.slice(pos, openIdx + OPEN.length);
    const contentStart = openIdx + OPEN.length;
    const closeIdx = html.indexOf(CLOSE, contentStart);
    
    if (closeIdx < 0) {
      result += html.slice(contentStart);
      pos = html.length;
      break;
    }
    
    const content = html.slice(contentStart, closeIdx);
    const textContent = content.replace(/<[^>]+>/g, '').trim();
    
    if (textContent.length > 0 && textContent.length < 20) {
      // Expandir o comentário curto
      const expanded = getExpansion(file, textContent, localIdx++);
      result += expanded + CLOSE;
      totalCorrigidos++;
      mudou = true;
    } else {
      result += content + CLOSE;
    }
    
    pos = closeIdx + CLOSE.length;
  }
  
  if (mudou) {
    fs.writeFileSync(filePath, result, 'utf8');
    console.log(`  ${file}: comentários curtos expandidos`);
  }
}

console.log('\n========================================');
console.log(`✔ Total de comentários curtos expandidos: ${totalCorrigidos}`);
console.log('========================================');
