/**
 * fix_id88.js
 * Ajusta preço do produto 88 (Conjunto Feminino de Alfaiataria) que estava alto e sem decalque
 */
const fs = require('fs');

// 1. catalogo.js
let cat = fs.readFileSync('js/catalogo.js', 'utf8');
cat = cat.replace(
  /\{id:88,nome:'Conjunto Feminino de Trabalho em Alfaiataria Larisa',preco:170.05,precoOrig:''\}/,
  "{id:88,nome:'Conjunto Feminino de Trabalho em Alfaiataria Larisa',preco:69.9,precoOrig:'397,80'}"
);
fs.writeFileSync('js/catalogo.js', cat, 'utf8');
console.log('✔ catalogo.js (ID 88) atualizado.');

// 2. products.json
let prod = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
prod.forEach(p => {
  if (p.id === 88) {
    p.preco = 69.9;
    p.precoOrig = '397,80';
    p.desconto = 82;
  }
});
fs.writeFileSync('data/products.json', JSON.stringify(prod, null, 4), 'utf8');
console.log('✔ products.json (ID 88) atualizado.');

// 3. produto-88.html
const htmlPath = 'pages/produto-88.html';
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  const secaoPrecoRegex = /<!-- SEÇÃO DE PREÇO -->[\s\S]*?<!-- INFO DO PRODUTO -->/;
  const novaSecao = `<!-- SEÇÃO DE PREÇO -->
    <div class="price-section">
      <div class="price-left">
        <div class="price-row">
          <div class="discount-badge-white">-82%</div>
          <div class="price-label-apartir">A partir de R$</div>
          <div class="price-current"><span>69,90</span></div>
        </div>
        <div class="price-original">R$ 397,80</div>
      </div>
      <div class="price-right">
        <div class="timer-row">
          <span class="timer-label">Termina em</span>
          <span class="timer-value oferta-timer">04:00:00</span>
        </div>
      </div>
    </div>

    <!-- INFO DO PRODUTO -->`;
    
  if (secaoPrecoRegex.test(html)) {
    html = html.replace(secaoPrecoRegex, novaSecao);
    
    // Objeto PRODUTO_ATUAL
    const prodAtualRegex = /const PRODUTO_ATUAL\s*=\s*\{[\s\S]*?\};/;
    const matches = html.match(prodAtualRegex);
    if (matches) {
      let objStr = matches[0];
      objStr = objStr.replace(/preco:\s*[\d\.]+/, `preco: 69.9`);
      objStr = objStr.replace(/precoOrig:\s*'[^']*'/, `precoOrig: '397,80'`);
      objStr = objStr.replace(/desconto:\s*\d+/, `desconto: 82`);
      html = html.replace(prodAtualRegex, objStr);
    }
    
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('✔ produto-88.html atualizado.');
  }
}
