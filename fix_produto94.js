/**
 * fix_produto94.js - Reconstrói a seção corrompida do produto-94.html
 * Insere as imagens faltantes, slider, abas e seção de preço corretamente
 */
const fs = require('fs');

let html = fs.readFileSync('pages/produto-94.html', 'utf8');

// A estrutura atual está:
// linha 61 encerra em img-5, depois vem <div class="discount-ticket"> indevidamente dentro do slider-track
// Precisamos:
// 1. Fechar o slider-track com as imagens 6-9 que faltam
// 2. Adicionar slider-counter e slider-dots
// 3. Adicionar as abas de navegação
// 4. Adicionar seção de preço completa com preço antigo
// 5. Abrir a div product-info corretamente

// Encontrar o ponto onde está "img-5" e depois o discount-ticket que não deveria estar lá
const imgStr5 = 'm78dqlbrfpv6c4" alt="Bicicleta Bike Ergometrica Spinning Academia Fitness Profissional 120kg - 5" onerror="this.style.display=\'none\'">';
const img5Pos = html.indexOf(imgStr5);

if (img5Pos === -1) {
  console.log('ERROR: Não encontrou img-5 no produto-94.html');
  process.exit(1);
}

// Posição após a imagem 5
const afterImg5 = img5Pos + imgStr5.length;

// Encontrar o bloco corrompido que começa com <div class="discount-ticket"> 
// que está indevidamente dentro do slider-track
const discountTicketPos = html.indexOf('<div class="discount-ticket">', afterImg5);

if (discountTicketPos === -1) {
  console.log('ERROR: Não encontrou discount-ticket após img-5');
  process.exit(1);
}

// O bloco entre afterImg5 e discountTicketPos é o que está errado (só há \r\n)
const between = html.slice(afterImg5, discountTicketPos);
console.log('Trecho entre img5 e discount-ticket:', JSON.stringify(between.slice(0, 50)));

// Montar o bloco correto que falta:
const blocoCorreto = `
        <img class="slider-img" src="https://down-br.img.susercontent.com/file/br-11134207-7r98o-m78dqlbrfpl666" alt="Bicicleta Bike Ergometrica Spinning Academia Fitness Profissional 120kg - 6" onerror="this.style.display='none'">
        <img class="slider-img" src="https://down-br.img.susercontent.com/file/br-11134207-7r98o-m78dqlbrv5u214" alt="Bicicleta Bike Ergometrica Spinning Academia Fitness Profissional 120kg - 7" onerror="this.style.display='none'">
        <img class="slider-img" src="https://down-br.img.susercontent.com/file/br-11134207-7r98o-m78dqlbsam2ye4" alt="Bicicleta Bike Ergometrica Spinning Academia Fitness Profissional 120kg - 8" onerror="this.style.display='none'">
        <img class="slider-img" src="https://down-br.img.susercontent.com/file/br-11134207-7r98o-m78dqlbrv642e3" alt="Bicicleta Bike Ergometrica Spinning Academia Fitness Profissional 120kg - 9" onerror="this.style.display='none'">
      </div>
      <div class="slider-counter">1 / 9</div>
    </div>
    <div class="slider-dots"></div>
    <!-- ABAS DE NAVEGAÇÃO SHOPEE STYLE -->
    <nav class="product-tabs">
      <button class="product-tab active" data-tab="visao-geral">Visão geral</button>
      <button class="product-tab" data-tab="avaliacoes">Avaliações</button>
      <button class="product-tab" data-tab="descricao">Descrição</button>
      <button class="product-tab" data-tab="recomendacoes">Recomendações</button>
    </nav>

    <!-- SEÇÃO DE PREÇO -->
    <div class="price-section">
      <div class="price-left">
        <div class="price-row">
          <div class="discount-badge-white">-80%</div>
          <div class="price-current"><span class="price-currency">R$</span><span>147,00</span></div>
        </div>
        <div class="price-old">R$ 735,00</div>
      </div>
      <div class="price-right">
        <div class="oferta-relampago">
          <span class="raio-icon">&#x26A1;</span>
          <span>Oferta Relâmpago</span>
        </div>
        <div class="timer-row">
          <span class="timer-label">Termina em</span>
          <span class="timer-value oferta-timer">04:00:00</span>
        </div>
      </div>
    </div>

    <!-- INFO DO PRODUTO -->
    <div class="product-info">

      `;

// Reconstituir o HTML: parte antes de afterImg5 + blocoCorreto + parte a partir de discount-ticket
html = html.slice(0, afterImg5) + blocoCorreto + html.slice(discountTicketPos);

fs.writeFileSync('pages/produto-94.html', html, 'utf8');
console.log('✔ produto-94.html corrigido com sucesso!');
console.log('Verificando: contém "price-old":', html.includes('price-old'));
console.log('Verificando: contém "oferta-timer":', html.includes('oferta-timer'));
console.log('Verificando: contém "product-tabs":', html.includes('product-tabs'));
console.log('Verificando: contém "735,00":', html.includes('735,00'));
