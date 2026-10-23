// Gerador de página de produto dinâmica
// Utilizado pelos produtos 89, 96, 97, 84, 79

function criarPaginaProduto(produto, todosOsProdutos) {
  const starsHTML = (n) => {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<svg class="review-star${i <= n ? '' : ' empty'}" fill="currentColor" viewBox="0 0 48 48" width="12" height="12"><path d="m25.22 2.72.12.06c1 .6 1.4 1.9 1.82 2.9l4.12 9.92.1.24.26.02 10.7.86c1.1.09 2.45.06 3.33.83.66.63.97 1.5.85 2.42-.19 1.2-1.36 2.01-2.22 2.76l-8.16 6.98-.2.17.06.25 2.5 10.45c.24 1.07.7 2.35.23 3.41a2.79 2.79 0 0 1-2.04 1.56c-1.2.2-2.33-.67-3.3-1.26l-9.17-5.6-.22-.13-.22.13-9.17 5.6c-.93.57-2.01 1.4-3.17 1.28a2.78 2.78 0 0 1-2.11-1.45c-.56-1.09-.09-2.44.18-3.54L12 30.13l.06-.25-.2-.17-8.15-6.98c-.84-.72-1.95-1.5-2.2-2.63-.19-.95.12-1.88.82-2.55.88-.77 2.24-.74 3.33-.83l10.7-.86.26-.02.1-.24 4.12-9.91c.44-1.05.85-2.42 1.94-2.97a2.8 2.8 0 0 1 2.44 0Z"/></svg>`;
    }
    return html;
  };

  const imagensHTML = produto.imagens.map((img, i) =>
    `<img class="slider-img" src="${img}" alt="${produto.nome} - ${i+1}" loading="${i === 0 ? 'eager' : 'lazy'}">`
  ).join('\n');

  const avaliacoesHTML = produto.avaliacoes.map(av => {
    const avatarHTML = av.avatar
      ? `<div class="review-avatar"><img src="${av.avatar}" alt="${av.nome}" loading="lazy"></div>`
      : `<div class="review-avatar">${av.letra || av.nome.charAt(0).toUpperCase()}</div>`;

    const fotosHTML = av.fotos && av.fotos.length
      ? `<div class="review-photos">${av.fotos.map(f => `<img class="review-photo" src="${f}" alt="Foto da avaliação" onclick="openPhotoModal(this.src)" loading="lazy">`).join('')}</div>`
      : '';

    const variacaoHTML = av.variacao ? `| Variação: ${av.variacao}` : '';

    return `
    <div class="review-card">
      <div class="review-header">
        <div class="review-user">
          ${avatarHTML}
          <div class="review-user-info">
            <div class="review-user-name">${av.nome}</div>
            <div class="review-user-stars">${starsHTML(av.estrelas)}</div>
            <div class="review-date">${av.data} ${variacaoHTML}</div>
          </div>
        </div>
      </div>
      ${av.comentario ? `<p class="review-comment">${av.comentario}</p>` : ''}
      ${fotosHTML}
    </div>`;
  }).join('');

  const relacionadosIds = Object.keys(todosOsProdutos).filter(id => parseInt(id) !== produto.id).slice(0, 4);
  const relacionadosHTML = relacionadosIds.map(id => {
    const p = todosOsProdutos[id];
    return `
    <a class="related-card" href="produto-${p.id}.html">
      <img class="related-img" src="${p.imagens[0]}" alt="${p.nome}" loading="lazy">
      <div class="related-info">
        <div class="related-name">${p.nome}</div>
        <div class="related-price-row">
          <span class="related-price">R$ ${p.preco.toFixed(2).replace('.',',')}</span>
          <span class="related-price-original">R$ ${p.precoOriginal.toFixed(2).replace('.',',')}</span>
        </div>
        <div class="related-badges">
          <span class="related-discount">${p.desconto}% OFF</span>
          <span class="badge-frete">· Frete grátis</span>
        </div>
        <div class="related-sold">${p.vendidos.toLocaleString('pt-BR')} vendido(s)</div>
      </div>
    </a>`;
  }).join('');

  const precoBR = produto.preco.toFixed(2).replace('.', ',');
  const precoOriginalBR = produto.precoOriginal.toFixed(2).replace('.', ',');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
  <title>${produto.nome} - Famosinhos Shop</title>
  <meta name="description" content="${produto.nome} com ${produto.desconto}% OFF. Apenas R$${precoBR}. Frete grátis. ${produto.vendidos} vendidos.">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<div class="app-container">

  <header class="header">
    <a class="header-back-btn" href="../index.html">
      <svg class="header-icon-svg" viewBox="0 0 24 24" width="22" height="22">
        <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
      </svg>
    </a>
    <div class="header-search-wrapper">
      <button class="header-search-icon-btn">
        <svg class="header-icon-svg" viewBox="0 0 24 24" width="18" height="18">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </button>
      <input type="text" class="header-search" placeholder="Pesquisar" readonly onclick="window.location='../index.html'">
    </div>
    <div class="header-icons">
      <a href="conta.html">
        <button class="header-icon-btn">
          <svg class="header-icon-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </a>
      <a href="carrinho.html">
        <button class="header-icon-btn" style="position:relative">
          <svg class="header-icon-svg" viewBox="0 0 24 24" width="22" height="22">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="cart-badge" style="display:none">0</span>
        </button>
      </a>
    </div>
  </header>

  <div class="page-content">

    <div class="image-slider">
      <div class="slider-track">
        ${imagensHTML}
      </div>
      <div class="slider-counter">1 / ${produto.imagens.length}</div>
    </div>
    <div class="slider-dots"></div>

    <div class="price-section">
      <div class="price-left">
        <div class="price-row">
          <div class="discount-badge-white">-${produto.desconto}%</div>
          <div class="price-current"><span class="price-currency">R$</span><span>${precoBR}</span></div>
        </div>
        <div class="price-original">R$ ${precoOriginalBR}</div>
      </div>
      <div class="price-right">
        <div class="oferta-relampago">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <polygon points="8.29 1.71 18.5 1.71 13.86 9.14 17.57 9.14 7.36 20.29 9.21 12.86 5.5 12.86 8.29 1.71" fill="#ffffff"/>
          </svg>
          <span>Oferta relâmpago</span>
        </div>
        <div class="timer-row">
          <span class="timer-label">Termina em</span>
          <span class="timer-value oferta-timer">04:00:00</span>
        </div>
      </div>
    </div>

    <div class="product-info">
      <div class="discount-ticket">
        <span class="product-badge-discount">
          <svg viewBox="0 0 667 534" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="18">
            <path d="M666.666 166.667C640.145 166.667 614.71 177.203 595.956 195.956C577.202 214.71 566.666 240.145 566.666 266.667C566.666 293.189 577.202 318.624 595.956 337.378C614.71 356.131 640.145 366.667 666.666 366.667L666.666 466.667C666.666 484.348 659.642 501.305 647.14 513.808C634.637 526.31 617.681 533.334 600 533.334L466.666 533.334L466.666 470.601C466.666 461.76 463.154 453.281 456.903 447.03C450.652 440.779 442.174 437.267 433.333 437.267C424.492 437.267 416.014 440.779 409.763 447.03C403.512 453.281 400 461.76 400 470.601L400 533.334L66.666 533.334C48.9852 533.334 32.0287 526.31 19.5264 513.808C7.02395 501.305 1.13666e-05 484.348 1.01189e-05 466.667L1.44901e-05 366.666C55.4279 366.576 100.333 321.616 100.333 266.167C100.333 210.718 55.4279 165.758 2.3276e-05 165.668L2.76035e-05 66.667C3.0397e-05 48.9859 7.02397 32.0288 19.5264 19.5264C32.0287 7.02422 48.9852 8.86041e-05 66.666 4.76048e-07L400 1.50465e-05L400 62.7334C400 71.5739 403.512 80.0525 409.763 86.3037C416.014 92.5549 424.492 96.0674 433.333 96.0674C442.174 96.0674 450.652 92.5549 456.903 86.3037C463.154 80.0525 466.666 71.5739 466.666 62.7334L466.666 1.79606e-05L600 2.37888e-05C617.681 0.000113468 634.637 7.02425 647.14 19.5264C659.642 32.0288 666.666 48.9859 666.666 66.667L666.666 166.667Z" fill="#FF2B56"/>
          </svg>
          ${produto.desconto}% OFF
        </span>
      </div>

      <h1 class="product-title">${produto.nome}</h1>

      <div class="ratings-row">
        <div class="star-row">
          <svg class="star-icon" fill="currentColor" viewBox="0 0 48 48" width="14" height="14"><path d="m25.22 2.72.12.06c1 .6 1.4 1.9 1.82 2.9l4.12 9.92.1.24.26.02 10.7.86c1.1.09 2.45.06 3.33.83.66.63.97 1.5.85 2.42-.19 1.2-1.36 2.01-2.22 2.76l-8.16 6.98-.2.17.06.25 2.5 10.45c.24 1.07.7 2.35.23 3.41a2.79 2.79 0 0 1-2.04 1.56c-1.2.2-2.33-.67-3.3-1.26l-9.17-5.6-.22-.13-.22.13-9.17 5.6c-.93.57-2.01 1.4-3.17 1.28a2.78 2.78 0 0 1-2.11-1.45c-.56-1.09-.09-2.44.18-3.54L12 30.13l.06-.25-.2-.17-8.15-6.98c-.84-.72-1.95-1.5-2.2-2.63-.19-.95.12-1.88.82-2.55.88-.77 2.24-.74 3.33-.83l10.7-.86.26-.02.1-.24 4.12-9.91c.44-1.05.85-2.42 1.94-2.97a2.8 2.8 0 0 1 2.44 0Z"/></svg>
          <span class="rating-number">${produto.avaliacao.toString().replace('.',',')}</span>
          <span class="rating-number">(${produto.totalAvaliacoes})</span>
        </div>
        <div class="divider-v"></div>
        <div class="sold-count">${produto.vendidos.toLocaleString('pt-BR')} vendido(s)</div>
      </div>

      <div class="frete-row">
        <div class="frete-icon">
          <svg width="20" height="20" viewBox="0 -2 20 20" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-2 -4)">
              <path d="M9.17,17H13V6a1,1,0,0,0-1-1H5" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path d="M3,13v3a1,1,0,0,0,1,1h.87" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path d="M14.87,17H13V7h4.25a1,1,0,0,1,1,.73L19,10.5l1.24.31a1,1,0,0,1,.76,1V16a1,1,0,0,1-1,1h-.89" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path d="M9,17a2,2,0,1,1-2-2A2,2,0,0,1,9,17Zm8-2a2,2,0,1,0,2,2A2,2,0,0,0,17,15ZM3,9H9" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </g>
          </svg>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
            <span class="product-badge">Frete grátis</span>
            <span class="frete-detail">Receba até ${produto.dataEntrega}</span>
          </div>
          <div class="frete-taxa">Taxa de envio: <s>R$ ${produto.taxaEnvio.toFixed(2).replace('.',',')}</s></div>
        </div>
      </div>

      <div class="urgency-bar">
        <span class="urgency-dot"></span>
        <span><strong class="pessoas-olhando-count" data-base="${produto.pessoasOlhando}">${produto.pessoasOlhando}</strong> pessoas olhando</span>
        <span class="urgency-separator">|</span>
        <span>Restam <strong>${produto.unidadesRestantes}</strong> unidades</span>
      </div>

      <div class="protection-section">
        <div class="protection-title">
          <svg width="20" height="20" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><g><path d="M24,44c0,0,20-4,20-34L24,4L4,10C4,42,24,44,24,44z M32.829,18L22,28.828L15.171,22L18,19.172l4,4l8-8L32.829,18z" fill="#8B4D0B"/></g></svg>
          Proteção do cliente
        </div>
        <div class="protection-grid">
          <div class="protection-item"><svg width="14" height="14" viewBox="0 0 16 16"><path fill="#8B4D0B" fill-rule="evenodd" d="M13.7071,4.29289 C14.0976,4.68342 14.0976,5.31658 13.7071,5.70711 L7.70711,11.7071 C7.31658,12.0976 6.68342,12.0976 6.29289,11.7071 L3.29289,8.70711 C2.90237,8.31658 2.90237,7.68342 3.29289,7.29289 C3.68342,6.90237 4.31658,6.90237 4.70711,7.29289 L7,9.58579 L12.2929,4.29289 C12.6834,3.90237 13.3166,3.90237 13.7071,4.29289 Z"/></svg>Devolução gratuita</div>
          <div class="protection-item"><svg width="14" height="14" viewBox="0 0 16 16"><path fill="#8B4D0B" fill-rule="evenodd" d="M13.7071,4.29289 C14.0976,4.68342 14.0976,5.31658 13.7071,5.70711 L7.70711,11.7071 C7.31658,12.0976 6.68342,12.0976 6.29289,11.7071 L3.29289,8.70711 C2.90237,8.31658 2.90237,7.68342 3.29289,7.29289 C3.68342,6.90237 4.31658,6.90237 4.70711,7.29289 L7,9.58579 L12.2929,4.29289 C12.6834,3.90237 13.3166,3.90237 13.7071,4.29289 Z"/></svg>Reembolso automático</div>
          <div class="protection-item"><svg width="14" height="14" viewBox="0 0 16 16"><path fill="#8B4D0B" fill-rule="evenodd" d="M13.7071,4.29289 C14.0976,4.68342 14.0976,5.31658 13.7071,5.70711 L7.70711,11.7071 C7.31658,12.0976 6.68342,12.0976 6.29289,11.7071 L3.29289,8.70711 C2.90237,8.31658 2.90237,7.68342 3.29289,7.29289 C3.68342,6.90237 4.31658,6.90237 4.70711,7.29289 L7,9.58579 L12.2929,4.29289 C12.6834,3.90237 13.3166,3.90237 13.7071,4.29289 Z"/></svg>Pagamento seguro</div>
          <div class="protection-item"><svg width="14" height="14" viewBox="0 0 16 16"><path fill="#8B4D0B" fill-rule="evenodd" d="M13.7071,4.29289 C14.0976,4.68342 14.0976,5.31658 13.7071,5.70711 L7.70711,11.7071 C7.31658,12.0976 6.68342,12.0976 6.29289,11.7071 L3.29289,8.70711 C2.90237,8.31658 2.90237,7.68342 3.29289,7.29289 C3.68342,6.90237 4.31658,6.90237 4.70711,7.29289 L7,9.58579 L12.2929,4.29289 C12.6834,3.90237 13.3166,3.90237 13.7071,4.29289 Z"/></svg>Cupom por atraso</div>
        </div>
      </div>

      <div class="description-section">
        <h3 class="section-title">Descrição</h3>
        <div class="description-text">${produto.descricao}</div>
      </div>

      <div class="reviews-section">
        <h3 class="reviews-header">Avaliações dos clientes (${produto.totalAvaliacoes})</h3>
        <div class="reviews-summary">
          <span class="review-avg">${produto.avaliacao}</span><span class="review-avg-total">/5</span>
          <div class="review-stars">
            ${starsHTML(Math.round(produto.avaliacao))}
          </div>
        </div>
        ${avaliacoesHTML}
        ${produto.totalAvaliacoes > produto.avaliacoes.length ? `<button class="ver-mais-btn">Ver mais avaliações (${produto.totalAvaliacoes - produto.avaliacoes.length} restantes) ›</button>` : ''}
      </div>

      <div class="related-section">
        <h3 class="related-title">Você também pode gostar</h3>
        <div class="related-grid">
          ${relacionadosHTML}
        </div>
      </div>

    </div>
  </div>

  <div class="bottom-bar">
    <button class="btn-add-cart" onclick="handleAddToCart()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      Carrinho
    </button>
    <button class="btn-buy" onclick="handleBuyNow()">
      Comprar agora | Frete grátis
    </button>
  </div>

</div>

<script src="../js/app.js"></script>
<script>
const PRODUTO_ATUAL = ${JSON.stringify({id: produto.id, nome: produto.nome, preco: produto.preco, img: produto.imagens[0], imagens: produto.imagens})};
function handleAddToCart() {
  addToCart(PRODUTO_ATUAL);
  showToast('✅ Produto adicionado ao carrinho!');
}
function handleBuyNow() {
  addToCart(PRODUTO_ATUAL);
  window.location.href = 'carrinho.html';
}
</script>
</body>
</html>`;
}

if (typeof module !== 'undefined') module.exports = { criarPaginaProduto };
