/**
 * restore_corrupted_products.js
 * Detecta e restaura barras inferiores e fechamentos de tags corrompidos em todos os produtos HTML.
 */
const fs = require('fs');
const path = require('path');

const pagesDir = 'pages';
const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

const svgLoja = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Telhado toldo ondulado Shopee Style -->
        <path d="M19 11V10l-1.5-4h-11L5 10v1c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2" />
        <!-- Base da lojinha -->
        <path d="M6 13v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7" />
      </svg>`;

const svgChat = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Balão de Chat Oval com Rabicho da Foto -->
        <path d="M21 11.5c0 4.7-4 8.5-9 8.5-.8 0-1.6-.1-2.4-.3L5 21l1.5-3.8C4.3 15.7 3 13.7 3 11.5 3 6.8 7 3 12 3s9 3.8 9 8.5z" />
      </svg>`;

const correctBottomBar = `  <!-- BOTTOM BAR -->
  <div class="bottom-bar">
    <button class="btn-icon-action" aria-label="Loja" onclick="window.location.href='../index.html'">
      ${svgLoja}
      Loja
    </button>
    <button class="btn-icon-action" aria-label="Chat" id="product-chat-btn">
      ${svgChat}
      Chat
    </button>
    <button class="btn-add-cart" id="btn-add-cart" onclick="handleAddToCart()">
      Adicionar<br>ao carrinho
    </button>
    <button class="btn-buy" id="btn-buy" onclick="handleBuyNow()">
      <span class="btn-line1">Comprar agora</span>
      <span class="btn-line2">Frete grátis</span>
    </button>
  </div>

<script src="../js/catalogo.js"></script>
<script src="../js/app.js"></script>
<script>`;

let totalCorrigidos = 0;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Se o arquivo tiver "btn-icon-action" mas não tiver "btn-add-cart" no final, foi cortado!
  const hasLoja = html.includes('aria-label="Loja"');
  const hasAddCart = html.includes('btn-add-cart');
  
  if (hasLoja && !hasAddCart) {
    console.log(`⚠️ ${file} está cortado! Restaurando...`);
    
    // Achar o início do corte (onde começa a bottom-bar ou onde foi cortado)
    const bottomBarStart = html.indexOf('<!-- BOTTOM BAR -->');
    let startCut = bottomBarStart;
    if (startCut === -1) {
      startCut = html.indexOf('<div class="bottom-bar">');
    }
    
    if (startCut !== -1) {
      // Localizar o início do bloco <script> com o objeto PRODUTO_ATUAL para não perdê-lo
      const scriptStart = html.indexOf('const PRODUTO_ATUAL');
      
      if (scriptStart !== -1) {
        // Pega o objeto PRODUTO_ATUAL e o resto do script até o final do arquivo
        const prodAtualAndRest = html.slice(scriptStart);
        
        // Reconstrói o HTML juntando a parte de cima intacta, a bottom-bar correta e o script restaurado
        const headerAndBody = html.slice(0, startCut);
        
        let restoredHtml = headerAndBody + correctBottomBar + '\n' + prodAtualAndRest;
        
        fs.writeFileSync(filePath, restoredHtml, 'utf8');
        totalCorrigidos++;
        console.log(`✔ ${file} restaurado com sucesso!`);
      } else {
        console.log(`❌ Não foi possível encontrar o PRODUTO_ATUAL no script de ${file}`);
      }
    }
  }
});

console.log(`\nProcessamento concluído. Total de arquivos restaurados: ${totalCorrigidos}`);
