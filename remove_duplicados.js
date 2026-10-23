/**
 * remove_duplicados.js
 * 
 * Este script analisa os produtos cadastrados no data/products.json,
 * identifica produtos duplicados pelo nome (mesmo nome normalizado) ou ID repetido,
 * e remove as duplicatas mantendo apenas o primeiro exemplar de cada.
 * Depois, atualiza o js/catalogo.js e remove arquivos HTML de produto sobressalentes.
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_JSON = path.join(__dirname, 'data', 'products.json');
const CATALOGO_JS = path.join(__dirname, 'js', 'catalogo.js');
const PAGES_DIR = path.join(__dirname, 'pages');

const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));

// Identificar duplicados pelo nome normalizado
const vistos = new Set();
const unicos = [];
const idsRemovidos = [];

for (const p of products) {
  const nomeNorm = p.nome.trim().toLowerCase().replace(/\s+/g, ' ');
  if (vistos.has(nomeNorm)) {
    console.log(`[DUPLICADO] Identificado: ID ${p.id} - "${p.nome}"`);
    idsRemovidos.push(p.id);
  } else {
    vistos.add(nomeNorm);
    unicos.push(p);
  }
}

console.log(`\nTotal original: ${products.length} produtos.`);
console.log(`Total únicos: ${unicos.length} produtos.`);
console.log(`Total removidos: ${idsRemovidos.length} produtos.`);

if (idsRemovidos.length === 0) {
  console.log('Nenhum produto duplicado encontrado.');
  process.exit(0);
}

// 1. Atualizar data/products.json
fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(unicos, null, 2), 'utf8');
console.log('✔ data/products.json atualizado.');

// 2. Atualizar js/catalogo.js
// Lemos o catalogo.js atual e removemos os itens com IDs removidos
let catalogoContent = fs.readFileSync(CATALOGO_JS, 'utf8');

// Usamos regex ou limpamos a estrutura para refletir os produtos únicos
// Vamos recriar o CATALOGO_PRODUTOS com base nos IDs que restaram
const catalogoItens = [];
const catalogoLinhas = catalogoContent.split('\n');

const catalogoMatch = catalogoContent.match(/const CATALOGO_PRODUTOS = \[\s*([\s\S]*?)\s*\];/);
if (catalogoMatch) {
  // Vamos reconstruir de forma limpa usando a lista de produtos unicos
  const novosItens = unicos.map(p => {
    // Monta imagem
    const imgs = Array.isArray(p.imagem) ? p.imagem : [p.imagem];
    const primeiraImg = imgs.find(i => i && !i.endsWith('.mp4')) || imgs[0] || '';
    
    // Calcula desconto se não tiver
    let desc = p.desconto || 80;
    if (p.preco_antigo && p.preco) {
      desc = Math.round((p.preco_antigo - p.preco) / p.preco_antigo * 100);
    }
    
    const precoOrig = p.preco_antigo ? `${p.preco_antigo.toFixed(2).replace('.', ',')}` : '';
    return `  {id:${p.id},nome:${JSON.stringify(p.nome)},preco:${p.preco},precoOrig:${JSON.stringify(precoOrig)},desc:${desc},vendidos:${p.vendidos || 0},img:${JSON.stringify(primeiraImg)}}`;
  });

  const novoCatalogoJS = `// Catálogo gerado automaticamente — usa apenas imagens estáticas (não vídeo)
const CATALOGO_PRODUTOS = [
${novosItens.join(',\n')}
];
`;
  fs.writeFileSync(CATALOGO_JS, novoCatalogoJS, 'utf8');
  console.log('✔ js/catalogo.js atualizado.');
}

// 3. Remover arquivos HTML de produto sobressalentes
for (const id of idsRemovidos) {
  const file = path.join(PAGES_DIR, `produto-${id}.html`);
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✔ Arquivo deletado: pages/produto-${id}.html`);
  }
}

// 4. Limpar referências aos IDs removidos no index.html e outros HTMLs
let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let removidosNoIndex = 0;

for (const id of idsRemovidos) {
  // Regex para achar blocos de link <a class="product-card-rec" href="pages/produto-ID.html" ...> ... </a>
  const cardRegex = new RegExp(`<a\\s+class="product-card-rec"\\s+href="pages/produto-${id}\\.html"[\\s\\S]*?<\\/a>`, 'g');
  if (cardRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(cardRegex, '');
    removidosNoIndex++;
  }
}

if (removidosNoIndex > 0) {
  fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml, 'utf8');
  console.log(`✔ index.html limpo (removidos ${removidosNoIndex} cards duplicados).`);
}

console.log('\nRemoção concluída com sucesso!');
