const fs = require('fs');
const path = require('path');

// Pasta das páginas
const pagesDir = path.join(__dirname, '..', 'pages');
if (!fs.existsSync(pagesDir)) {
  console.error("Pasta pages não encontrada em: " + pagesDir);
  process.exit(1);
}

const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

// Array de nomes disponíveis de usuários brasileiros realistas
const NOMES_POOL = [
  "lucas_santos93", "mari_oliveira", "pedro.almeida", "ana_costa95", "gabriel_lima_br",
  "juliana.souza", "felipe_rocha91", "beatriz_gomes", "bruno.silva", "larissa.santos",
  "tiago_mendes94", "camila.ribeiro", "diego_alves_sp", "fernanda_carvalho", "rodrigo_melo90",
  "aline_pinto_rj", "gustavo.nunes", "amanda_barros98", "andre_teixeira", "carol_machado",
  "ricardo_freitas92", "vanessa_dias", "marcelo.nascimento", "patricia_ramos", "thiago_vieira96",
  "leticia_castro", "renan_cardoso97", "camila_martins", "vinicius.barbosa", "jessica_araujo",
  "mateus_correia95", "isabela.fonseca", "leonardo_duarte", "gabriela.lopes", "eduardo_guimaraes",
  "priscila_perez", "alexandre.siqueira", "tati_sales", "danilo_moraes93", "monica.viana",
  "hugo_macedo", "sabrina.furtado", "caio_antunes94", "renata_borges", "otavio.peixoto",
  "talita.assis", "igor_melo92", "bianca_neves", "arthur.colombo", "clara_valente",
  "eduardo.costa", "ricardinho_silva", "gabi_marques", "luis_gustavo", "mariana.alves",
  "rafael.macedo", "bruna_siqueira", "daniela.santos", "joao_pedro94", "leticia_lima",
  "marcos_souza", "amanda.freitas", "renan.silva", "carolina.mendes", "vitor_almeida",
  "juliana_reis", "tiago.barbosa", "larissa_melo", "felipe_costa", "patricia.oliveira",
  "lucas.teixeira", "fernando_gomes", "camila_souza", "rodrigo.moraes", "aline.santos",
  "diego_nunes", "beatriz.silva", "gabriel_melo", "vanessa.rocha", "marcelo_ramos",
  "leticia.santos", "renata_melo", "caio.lima", "bianca.costa", "igor_silva",
  "jessica.melo", "mateus_barbosa", "isabela_moura", "danilo.silva", "talita_reis"
];

let totalAlterados = 0;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Vamos primeiro encontrar todas as ocorrências de review-user-name
  const regexNome = /<div class="review-user-name">([^<]+)<\/div>/g;
  let match;
  const nomesNaPagina = [];
  const frequencias = {};
  
  while ((match = regexNome.exec(html)) !== null) {
    const nome = match[1].trim();
    nomesNaPagina.push({
      nome: nome,
      index: match.index,
      fullMatch: match[0]
    });
    frequencias[nome] = (frequencias[nome] || 0) + 1;
  }
  
  // Nomes que precisam ser substituídos:
  // - Qualquer nome que aparece repetido na página
  // - Ou o nome específico 'carlos_silva92'
  const precisaSubstituir = (nome) => {
    return frequencias[nome] > 1 || nome.toLowerCase() === 'carlos_silva92';
  };
  
  // Se nenhuma avaliação precisa de substituição, pula o arquivo
  const temDuplicados = nomesNaPagina.some(n => precisaSubstituir(n.nome));
  if (!temDuplicados) return;
  
  // Vamos fazer a substituição de trás para frente para não alterar os índices de match
  let novoHtml = html;
  let circularIdx = Math.floor(Math.random() * NOMES_POOL.length);
  
  // Copia o pool e embaralha para cada página para garantir variabilidade
  const poolLocal = [...NOMES_POOL];
  for (let i = poolLocal.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [poolLocal[i], poolLocal[j]] = [poolLocal[j], poolLocal[i]];
  }
  
  for (let i = nomesNaPagina.length - 1; i >= 0; i--) {
    const item = nomesNaPagina[i];
    if (precisaSubstituir(item.nome)) {
      // Escolhe um novo nome único localmente
      const novoNome = poolLocal[circularIdx % poolLocal.length];
      circularIdx++;
      const inicial = novoNome[0].toUpperCase();
      
      const posNome = item.index;
      
      // 1. Substituir o nome na string
      const tagAntiga = item.fullMatch;
      const tagNova = `<div class="review-user-name">${novoNome}</div>`;
      
      // Vamos obter os 300 caracteres anteriores no HTML original (antes do posNome)
      const startPos = Math.max(0, posNome - 300);
      let trechoAnterior = novoHtml.slice(startPos, posNome);
      
      // Tentamos achar e substituir o placeholder: class="review-avatar-placeholder">X
      const placeholderRegex = /class="review-avatar-placeholder">([A-Z])<\/div>/i;
      const matchPlaceholder = trechoAnterior.match(placeholderRegex);
      
      if (matchPlaceholder) {
        const letraAntiga = matchPlaceholder[1];
        const placeholderAntigo = `class="review-avatar-placeholder">${letraAntiga}</div>`;
        const placeholderNovo = `class="review-avatar-placeholder">${inicial}</div>`;
        trechoAnterior = trechoAnterior.replace(placeholderAntigo, placeholderNovo);
      }
      
      // Também tentamos achar e substituir o alt="nome_antigo"
      const altAntigo = `alt="${item.nome}"`;
      const altNovo = `alt="${novoNome}"`;
      if (trechoAnterior.includes(altAntigo)) {
        trechoAnterior = trechoAnterior.replace(new RegExp(altAntigo, 'g'), altNovo);
      } else {
        const altRegex = /alt="([^"]+)"/;
        const matchAlt = trechoAnterior.match(altRegex);
        if (matchAlt && matchAlt[1] === item.nome) {
          trechoAnterior = trechoAnterior.replace(matchAlt[0], `alt="${novoNome}"`);
        }
      }
      
      // Reconstrói a string com o trecho anterior modificado e o novo nome
      novoHtml = novoHtml.slice(0, startPos) + trechoAnterior + tagNova + novoHtml.slice(posNome + tagAntiga.length);
      totalAlterados++;
    }
  }
  
  // Salva de volta
  fs.writeFileSync(filePath, novoHtml, 'utf8');
  console.log(`  Corrigido: ${file}`);
});

console.log(`\n========================================`);
console.log(`✔ Total de nomes corrigidos: ${totalAlterados}`);
console.log(`========================================`);
