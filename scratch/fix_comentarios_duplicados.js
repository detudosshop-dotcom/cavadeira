const fs = require('fs');
const path = require('path');

// Pasta das páginas
const pagesDir = path.join(__dirname, '..', 'pages');
if (!fs.existsSync(pagesDir)) {
  console.error("Pasta pages não encontrada em: " + pagesDir);
  process.exit(1);
}

const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

// Banco de dados de novos comentários exclusivos e realistas por tema
const COMENTARIOS_POOL = {
  'caixa|som|speaker|bluetooth|audio|falante|aiwa|boombox|jbl': [
    'O som é incrivelmente nítido, e o grave impressiona demais. A conectividade bluetooth funciona muito rápido e a bateria aguenta o dia todo de festa.',
    'Excelente custo-benefício. O design é lindo e o som é super potente, preenche a sala inteira sem distorcer nada. Recomendo muito!',
    'Muito bom! Produto resistente à água, levei pra piscina e funcionou perfeitamente. O som é limpo e potente. Vale cada centavo.',
    'A qualidade do som me surpreendeu muito positivamentel. O acabamento é impecável e a bateria realmente dura as 24 horas prometidas. Muito feliz com a compra.',
    'Sensacional! A caixa de som é robusta, tem graves profundos e um visual lindo. Chegou super rápido e muito bem embalada.',
    'A melhor caixa de som que já tive. O som é forte e limpo, ideal para reuniões com amigos e churrasco. O bluetooth conecta muito fácil.',
    'Muito satisfeito! Som de altíssima fidelidade e bateria duradoura. Compacta mas muito potente. Recomendo com certeza!',
    'O som é perfeito, graves potentes e médios muito claros. O acabamento é de altíssima qualidade e o bluetooth é bem estável.',
    'Caixa fantástica! Muito potente e limpa, a bateria dura muito mesmo. Ótima qualidade de construção e acabamento premium.',
    'Estou usando todo dia e amando! Qualidade sonora de alto nível, design moderno e muito fácil de carregar para qualquer lugar.'
  ],
  'bicicleta|spinning|ergometrica|fitness|academia|exercicio|pedal': [
    'Bicicleta super robusta e silenciosa, perfeita para treinar em casa sem incomodar ninguém. O banco é confortável e os ajustes são precisos.',
    'Excelente compra. A montagem foi super simples e o nível de resistência varia muito bem, permitindo treinos leves ou bem pesados.',
    'Muito firme e estável. Pedalar nela passa muita segurança. O display funciona perfeitamente marcando calorias e distância.',
    'Comprei para toda a família treinar e foi um ótimo investimento. Ocupa pouco espaço e o acabamento é excelente. Super indico!',
    'Equipamento de academia dentro de casa. Muito silenciosa, pedalo assistindo TV tranquilamente. Qualidade de primeira.',
    'Superou minhas expectativas! A regulagem de altura do banco e do guidão atende muito bem. Estrutura forte e bem pesada.',
    'Ótimo custo-benefício! Muito confortável e resistente. Chegou antes do prazo e com todas as peças bem organizadas para montagem.',
    'Estou usando há semanas e o desempenho é perfeito. Muito macia ao pedalar e silenciosa. Recomendo demais!',
    'Bicicleta de altíssima qualidade. O banco não machuca e a estabilidade dela no chão é excelente. Compra 100% satisfatória.',
    'Design moderno e muito eficiente. Perfeita para quem quer manter a rotina de exercícios no conforto de casa.'
  ],
  'tenis|sapato|calcado|chuteira|sandalia|chinelo|calçado': [
    'Muito confortável para o dia a dia e caminhadas. O material é flexível e respira muito bem. O tamanho veio certinho conforme a tabela.',
    'Lindo demais e super leve no pé. O amortecimento é excelente, uso na academia e para correr e sinto zero dores. Qualidade nota 10.',
    'Produto excelente e muito resistente. O acabamento da costura e da cola é impecável. Chegou super rápido na caixa original.',
    'Amei! Muito macio e confortável por dentro. A cor é idêntica à da foto. Excelente para trabalhar ou passear o dia todo.',
    'Excelente custo-benefício. Tênis bem construído, sola antiderrapante com ótima aderência e palmilha anatômica muito boa.',
    'Perfeito! Comprei para dar de presente e o caimento ficou excelente. Material durável e muito fácil de limpar.',
    'Sapatilha muito confortável e flexível, parece que estou descalço de tão leve. O tecido é de alta qualidade. Recomendo!',
    'Muito satisfeito com o calçado. Lindo design, costuras firmes e muito confortável para usar o dia todo. Entrega rápida.',
    'Super confortável, o solado absorve bem o impacto. Ideal para atividades físicas e uso diário. Vale muito a pena.',
    'Ótima qualidade e design moderno. O calce é perfeito e não aperta nas laterais. Com certeza comprarei outras cores.'
  ],
  'camiseta|camisa|roupa|blusa|vestido|calca|shorts|moletom|moda': [
    'O tecido é super macio e confortável, de algodão de ótima qualidade. Não encolheu nada após a primeira lavagem. Costuras perfeitas.',
    'Ficou lindo no corpo, o caimento é excelente. As cores são vivas e a estampa é de alta qualidade, não racha nem desbota.',
    'Material excelente e acabamento de alto nível. O tamanho seguiu exatamente a tabela de medidas. Muito satisfeito com a compra.',
    'Amei muito! A blusa é confortável, estilosa e veste super bem. O envio foi super rápido e chegou muito bem embalada.',
    'Tecido leve e fresco, excelente para o verão. Muito confortável e com costuras bem finalizadas. Recomendo a loja!',
    'Muito estilosa e confortável. O acabamento é impecável e veste muito bem. Comprarei mais vezes com certeza.',
    'Roupa de excelente qualidade, tecido resistente que não amassa fácil. O tamanho ficou perfeito. Muito satisfeito!',
    'Veste perfeitamente e é muito confortável. A cor é linda e o tecido é muito agradável ao toque. Ótima qualidade.',
    'Superou as expectativas. Tecido encorpado que assenta muito bem no corpo. Acabamento muito caprichoso.',
    'Muito confortável e com ótimo acabamento. Ideal tanto para o dia a dia quanto para sair. Recomendo muito.'
  ],
  'fone|headphone|earphone|auricular|earbuds|tws|ouvido': [
    'O som é espetacular com agudos nítidos e graves bem definidos. O cancelamento de ruído funciona super bem no dia a dia.',
    'Excelente autonomia de bateria, passo dias sem precisar recarregar a caixinha. O encaixe no ouvido é firme e não cai na corrida.',
    'Muito leve e confortável, quase esqueço que estou usando. O bluetooth conecta imediatamente ao tirar da case e não falha.',
    'Qualidade de áudio excelente pelo preço pago. Microfone capta a voz de forma bem limpa nas chamadas de trabalho. Recomendo!',
    'Perfeito! O isolamento acústico é ótimo e os comandos por toque respondem de forma imediata. O design é bem minimalista e bonito.',
    'Fone sensacional. Graves muito fortes e som limpo. O encaixe é confortável e isola bem os barulhos da rua. Ótimo custo-benefício.',
    'Estou usando na academia e o desempenho é perfeito. Não cai do ouvido e resiste bem ao suor. Bateria de longa duração.',
    'Som muito bem equilibrado e conectividade excelente sem delay em vídeos. Case compacta e bem construída.',
    'Excelente qualidade de som e construção premium. Os fones são confortáveis e a bateria dura muitas horas. Satisfeito!',
    'Melhor fone que já comprei nessa faixa de preço. Áudio limpo, bom volume e conexão bluetooth instantânea.'
  ],
  'relogio|smartwatch|watch|pulso|smart': [
    'O relógio é muito bonito e elegante. As medições de batimentos cardíacos e passos são bem precisas e sincronizam fácil com o app.',
    'Bateria dura quase uma semana de uso constante. A tela tem excelente brilho e nitidez sob a luz do sol. Recomendo muito!',
    'Excelente smartwatch. As notificações do WhatsApp e ligações chegam na hora. Pulseira de silicone muito confortável e macia.',
    'Muito fácil de mexer e configurar. Possui muitas opções de mostradores e os sensores funcionam perfeitamente. Ótimo custo-benefício.',
    'Superou as expectativas. É leve, confortável no pulso e tem acabamento premium. A tela responde rápido ao toque.',
    'Lindo smartwatch, visual bem moderno e esportivo. Monitoramento de sono e exercícios muito completo e detalhado.',
    'Excelente qualidade de tela e construção. Muito prático para o dia a dia e atividades físicas. Bateria excelente.',
    'Relógio incrível, muito completo e com sistema rápido. Sincroniza perfeitamente com o celular. Satisfeito com a compra.',
    'Muito resistente e bonito. A pulseira tem bom ajuste e a interface do relógio é bem intuitiva de usar. Recomendo.',
    'Excelente parceiro de treinos. Monitora tudo de forma simples e exporta para o celular. Vale muito a pena.'
  ],
  'perfume|fragancia|cosmetico|maquiagem|creme|serum|beleza': [
    'Fragrância maravilhosa e com excelente projeção. Fixação dura o dia inteiro na pele e na roupa. Recebi muitos elogios!',
    'Produto excelente, textura leve que não deixa a pele oleosa e absorve rápido. Minha pele ficou muito macia e hidratada.',
    'Original e muito bem embalado. A fixação é espetacular, ideal para usar à noite ou em ocasiões especiais. Recomendo!',
    'Amei muito! Cheiro marcante mas super agradável, nada enjoativo. O frasco é lindo e a entrega foi super rápida.',
    'Produto de altíssima qualidade, cumpre perfeitamente o que promete na descrição. Uso diariamente e notei ótimos resultados.',
    'Excelente fixação e aroma delicioso. A marca é muito tradicional e a qualidade é indiscutível. Compra perfeita!',
    'Perfume marcante e muito sofisticado. A fixação dura mais de 8 horas tranquilamente. Ótimo custo-benefício.',
    'Muito satisfeita. O produto é de alta qualidade, chegou super rápido e com lacre original. Loja muito confiável.',
    'Cheiro maravilhoso que agrada a todos, fixação excelente. Ideal para dar de presente. Voltarei a comprar com certeza.',
    'Fragrância incrível e muito versátil, dá para usar tanto de dia quanto à noite. Muito elegante e marcante.'
  ],
  'aspirador|extratora|higienizadora|limpeza|vassoura': [
    'A potência de sucção é incrível, limpa sofás e tapetes de forma espetacular. Retira manchas e sujeiras profundas muito fácil.',
    'Muito prático e fácil de usar no dia a dia. A higienização fica profissional. Excelente para quem tem pets em casa.',
    'Superou as expectativas. Limpei o colchão e a cor da água saiu preta, limpa muito profundamente mesmo. Ótimo investimento.',
    'Equipamento robusto, fácil de montar e de limpar após o uso. A potência do motor é excelente. Recomendo muito!',
    'Limpeza de estofados profissional em casa. O produto é leve de carregar e a mangueira tem ótimo alcance. Muito satisfeito.',
    'Excelente poder de limpeza e aspiração. O sofá de casa ficou parecendo novo após a lavagem. Vale cada centavo.',
    'Muito prático para limpezas rápidas e pesadas. Sucção muito forte e fácil manuseio. Chegou antes do prazo.',
    'Excelente custo-benefício. Cumpre perfeitamente a função de extração e aspiração de água. Design moderno e resistente.',
    'Equipamento indispensável para manter a casa limpa e livre de ácaros. Muito fácil de usar e higienizar. Recomendo.',
    'Limpa e aspira com muita eficiência. O resultado nos bancos do carro foi impressionante. Compra excelente!'
  ],
  'default': [
    'Produto excelente! Chegou antes do prazo e muito bem embalado. A qualidade é muito superior ao esperado. Super recomendo!',
    'Superou todas as expectativas! Produto idêntico às fotos do anúncio, com acabamento excelente e material de primeira.',
    'Compra muito satisfatória. O produto funciona perfeitamente, é muito prático e resistente. Loja confiável e envio rápido.',
    'Excelente custo-benefício! Muito satisfeito com a qualidade geral e utilidade do produto. Com certeza comprarei novamente.',
    'Produto maravilhoso, muito bem construído e funcional. Veio tudo certinho e funcionando perfeitamente. Recomendo!',
    'Qualidade surpreendente pelo preço cobrado. O produto é resistente e atende perfeitamente ao que se propõe. Nota 10.',
    'Muito prático e com ótimo acabamento. Chegou bem rápido e o atendimento foi excelente. Voltarei a comprar.',
    'Estou usando diariamente e o desempenho é exemplar. Qualidade superior e muito durável. Muito satisfeito!',
    'Excelente aquisição. O produto veio completo, bem embalado e é de altíssima qualidade. Vale muito a pena.',
    'Design moderno, muito fácil de usar e excelente durabilidade. Superou minhas expectativas iniciais.'
  ]
};

// Helper para selecionar o pool correspondente ao tema
function getThemePool(filename, title) {
  const text = (filename + " " + title).toLowerCase();
  for (const [pattern, pool] of Object.entries(COMENTARIOS_POOL)) {
    if (pattern === 'default') continue;
    if (new RegExp(pattern, 'i').test(text)) {
      return pool;
    }
  }
  return COMENTARIOS_POOL['default'];
}

let totalComentariosCorrigidos = 0;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // 1. Descobrir o título do produto para racionalidade
  const titleMatch = html.match(/<h1 class="product-title">([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
  const productTitle = titleMatch ? titleMatch[1].trim() : '';
  
  const pool = getThemePool(file, productTitle);
  
  // 2. Encontrar todos os comentários
  const regexComment = /<p class="review-comment">([\s\S]*?)<\/p>/g;
  let match;
  const comentarios = [];
  const frequencias = {};
  
  while ((match = regexComment.exec(html)) !== null) {
    const rawComment = match[1].trim();
    // Limpa HTML simples e normaliza espaços para detectar duplicatas reais
    const cleanComment = rawComment.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
    comentarios.push({
      raw: rawComment,
      clean: cleanComment,
      index: match.index,
      fullMatch: match[0]
    });
    frequencias[cleanComment] = (frequencias[cleanComment] || 0) + 1;
  }
  
  // Nomes de comentários duplicados que precisam ser modificados
  const precisaModificar = (cleanText) => {
    return frequencias[cleanText] > 1;
  };
  
  const temDuplicados = comentarios.some(c => precisaModificar(c.clean));
  if (!temDuplicados) return;
  
  // Vamos fazer a substituição de trás para frente para não bagunçar os índices de match
  let novoHtml = html;
  let circularIdx = Math.floor(Math.random() * pool.length);
  
  // Rastreia quais textos limpos já foram "deixados" uma vez (o primeiro a gente mantém, os próximos a gente altera)
  const mantidos = {};
  
  // Copia o pool e embaralha para cada página para garantir aleatoriedade
  const poolLocal = [...pool];
  for (let i = poolLocal.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [poolLocal[i], poolLocal[j]] = [poolLocal[j], poolLocal[i]];
  }
  
  for (let i = comentarios.length - 1; i >= 0; i--) {
    const item = comentarios[i];
    if (precisaModificar(item.clean)) {
      // Se for a PRIMEIRA ocorrência deste comentário (de cima para baixo), a gente mantém ela!
      // Como estamos vindo de trás para frente, se houver ocorrências anteriores dele (índice menor), a gente altera esta!
      const isFirstOccurrence = comentarios.findIndex(c => c.clean === item.clean) === i;
      
      if (!isFirstOccurrence) {
        // Altera esta ocorrência duplicada por um comentário exclusivo do tema
        const novoComentario = poolLocal[circularIdx % poolLocal.length];
        circularIdx++;
        
        const posComment = item.index;
        const tagAntiga = item.fullMatch;
        const tagNova = `<p class="review-comment">${novoComentario}</p>`;
        
        novoHtml = novoHtml.slice(0, posComment) + tagNova + novoHtml.slice(posComment + tagAntiga.length);
        totalComentariosCorrigidos++;
      }
    }
  }
  
  // Salva de volta
  fs.writeFileSync(filePath, novoHtml, 'utf8');
  console.log(`  Comentários corrigidos em: ${file} (${productTitle})`);
});

console.log(`\n========================================`);
console.log(`✔ Total de avaliações duplicadas reescritas: ${totalComentariosCorrigidos}`);
console.log(`========================================`);
