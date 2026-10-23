/**
 * fix_variacoes_moda.js
 * 
 * Para cada produto HTML que tenha variações no products.json,
 * atualiza o PRODUTO_ATUAL para incluir as variações
 * e substitui handleAddToCart/handleBuyNow por handleAddToCartWithVariacoes.
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, 'pages');
const PRODUCTS_JSON = path.join(__dirname, 'data', 'products.json');

const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));

let updated = 0;
let skipped = 0;

for (const prod of products) {
  // Verifica se tem variações com ao menos uma chave
  const variacoes = prod.variacoes;
  const temVar = variacoes && !Array.isArray(variacoes) && Object.keys(variacoes).length > 0;
  
  if (!temVar) {
    skipped++;
    continue;
  }

  const htmlPath = path.join(PAGES_DIR, `produto-${prod.id}.html`);
  if (!fs.existsSync(htmlPath)) {
    console.log(`[SKIP] produto-${prod.id}.html não encontrado`);
    skipped++;
    continue;
  }

  let html = fs.readFileSync(htmlPath, 'utf8');

  // Verifica se já tem o script atualizado
  if (html.includes('handleAddToCartWithVariacoes')) {
    console.log(`[OK] produto-${prod.id}.html já atualizado`);
    skipped++;
    continue;
  }

  // Procura o bloco <script> do PRODUTO_ATUAL no final do arquivo
  const scriptRegex = /(<script>[\s\S]*?const PRODUTO_ATUAL = \{[\s\S]*?\};[\s\S]*?<\/script>)/;
  const match = html.match(scriptRegex);
  
  if (!match) {
    console.log(`[SKIP] produto-${prod.id}.html — bloco PRODUTO_ATUAL não encontrado`);
    skipped++;
    continue;
  }

  // Monta imagem principal sem mp4
  const imgs = Array.isArray(prod.imagem) ? prod.imagem : [prod.imagem];
  const primeiraImg = imgs.find(i => i && !/\.(mp4|webm|ogg|mov)$/i.test(i)) || imgs[0] || '';

  // Serializa variações
  const variacoesJSON = JSON.stringify(variacoes);

  // Novo bloco de script
  const novoScript = `<script>
const PRODUTO_ATUAL = {
  id: ${prod.id},
  nome: ${JSON.stringify(prod.nome)},
  preco: ${prod.preco},
  img: ${JSON.stringify(primeiraImg)},
  imagens: ${JSON.stringify(imgs)},
  variacoes: ${variacoesJSON}
};

function handleAddToCart() {
  handleAddToCartWithVariacoes(PRODUTO_ATUAL, false);
}

function handleBuyNow() {
  handleAddToCartWithVariacoes(PRODUTO_ATUAL, true);
}
</script>`;

  // Substitui o bloco antigo
  html = html.replace(match[0], novoScript);

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`[UPDATED] produto-${prod.id}.html — variações: ${Object.keys(variacoes).join(', ')}`);
  updated++;
}

console.log(`\n✅ Concluído! ${updated} arquivos atualizados, ${skipped} ignorados.`);
