/**
 * fix_prices_and_decals.js
 * Corrige preços abusivos e preenche as informações dos decalques de preço
 * que estavam quebrados/incompletos nos produtos informados e no catálogo.
 */
const fs = require('fs');
const path = require('path');

// ========================================================
// 1. CORRIGIR CATALOGO.JS E PRODUCTS.JSON
// ========================================================
const catalogoPath = 'js/catalogo.js';
let catalogoContent = fs.readFileSync(catalogoPath, 'utf8');

// Correções específicas de preços no catalogo.js
const correcoes = [
  { id: 92, preco: 79.9, precoOrig: '597,90', desc: 86 }, // Panelas de Ferro
  { id: 33, preco: 59.9, precoOrig: '397,80', desc: 85 }, // Mochila Bluey
  { id: 91, preco: 79.9, precoOrig: '647,90', desc: 87 }  // Pipoqueira Philco
];

correcoes.forEach(c => {
  // Substituir a linha do respectivo ID
  const regex = new RegExp(`\\{id:${c.id},nome:'([^']*)',preco:[\\d\\.]+,precoOrig:'[^']*'`);
  catalogoContent = catalogoContent.replace(regex, `{id:${c.id},nome:'$1',preco:${c.preco},precoOrig:'${c.precoOrig}'`);
});

fs.writeFileSync(catalogoPath, catalogoContent, 'utf8');
console.log('✔ js/catalogo.js atualizado com novos preços.');

// Corrigir no data/products.json
const productsJsonPath = 'data/products.json';
let productsJson = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

productsJson.forEach(p => {
  const corr = correcoes.find(c => c.id === p.id);
  if (corr) {
    p.preco = corr.preco;
    p.precoOrig = corr.precoOrig;
    p.desconto = corr.desc;
  }
});

fs.writeFileSync(productsJsonPath, JSON.stringify(productsJson, null, 4), 'utf8');
console.log('✔ data/products.json atualizado.');

// ========================================================
// 2. CORRIGIR DECALQUES NO HTML DOS PRODUTOS
// ========================================================
correcoes.forEach(c => {
  const htmlPath = `pages/produto-${c.id}.html`;
  if (!fs.existsSync(htmlPath)) {
    console.log(`⚠️ Arquivo ${htmlPath} não encontrado.`);
    return;
  }
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Vamos substituir a seção de preço inteira para ter a estrutura de decalque absoluta do style.css
  const precoSectionRegex = /<!-- SEÇÃO DE PREÇO -->[\s\S]*?<!-- INFO DO PRODUTO -->/;
  
  const novaSecaoPreco = `<!-- SEÇÃO DE PREÇO -->
    <div class="price-section">
      <div class="price-left">
        <div class="price-row">
          <div class="discount-badge-white">-${c.desc}%</div>
          <div class="price-label-apartir">A partir de R$</div>
          <div class="price-current"><span>${c.preco.toFixed(2).replace('.', ',')}</span></div>
        </div>
        <div class="price-original">R$ ${c.precoOrig}</div>
      </div>
      <div class="price-right">
        <div class="timer-row">
          <span class="timer-label">Termina em</span>
          <span class="timer-value oferta-timer">04:00:00</span>
        </div>
      </div>
    </div>

    <!-- INFO DO PRODUTO -->`;

  if (precoSectionRegex.test(html)) {
    html = html.replace(precoSectionRegex, novaSecaoPreco);
    
    // Atualizar também o PRODUTO_ATUAL no final do arquivo
    const prodAtualRegex = /const PRODUTO_ATUAL\s*=\s*\{[\s\S]*?\};/;
    const matches = html.match(prodAtualRegex);
    if (matches) {
      let objStr = matches[0];
      objStr = objStr.replace(/preco:\s*[\d\.]+/, `preco: ${c.preco}`);
      objStr = objStr.replace(/precoOrig:\s*'[^']*'/, `precoOrig: '${c.precoOrig}'`);
      objStr = objStr.replace(/desconto:\s*\d+/, `desconto: ${c.desc}`);
      html = html.replace(prodAtualRegex, objStr);
    }

    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`✔ Decalque e objeto JS de produto-${c.id}.html atualizados.`);
  } else {
    console.log(`⚠️ Não foi possível localizar a seção de preço em produto-${c.id}.html`);
  }
});
