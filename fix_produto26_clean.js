/**
 * fix_produto26_normalized.js
 * Restaura o produto-26.html limpando a parte final corrompida das avaliações
 * normalizando as quebras de linha para evitar incompatibilidades de \r\n.
 */
const fs = require('fs');

const filePath = 'pages/produto-26.html';
let html = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// Procuramos o comentário da última avaliação íntegra
const targetComment = 'Chegou rápido, e bem certinho, super fácil de montar, só não consegui por a capota, já coloquei minha bebê e dei certo espero que seja resistente, recomendo';
const lastGoodIdx = html.indexOf(targetComment);

if (lastGoodIdx === -1) {
  console.log('Não foi possível localizar o comentário alvo.');
  process.exit(1);
}

// Localizar o fechamento da div do card (</div>) logo após as fotos dessa avaliação
const nextCardIdx = html.indexOf('<div class="review-card">', lastGoodIdx);
if (nextCardIdx === -1) {
  console.log('Não foi possível localizar a próxima div de avaliação para cortar.');
  process.exit(1);
}

// Cortar o cabeçalho e as avaliações boas até antes do próximo review-card
const cleanHeaderAndReviews = html.slice(0, nextCardIdx).trim();

// Localizar a related-section correta que está no final
const relatedStart = html.lastIndexOf('<!-- PRODUTOS RELACIONADOS -->');
if (relatedStart === -1) {
  console.log('Não foi possível localizar a related-section.');
  process.exit(1);
}

const bottomBarAndRest = html.slice(relatedStart);

// Montar o HTML final
const restoredHtml = cleanHeaderAndReviews + `
        </div> <!-- fim mais-reviews-26 -->
        <button class="ver-mais-btn" id="ver-mais-btn-26" onclick="verMaisReviews('mais-reviews-26','ver-mais-btn-26',51)">Ver mais avaliações (51 restantes) ›</button>
      </div> <!-- fim reviews-section -->

      ` + bottomBarAndRest;

// Grava o arquivo de volta no padrão original do OS (que o Node faz automaticamente com writeFileSync)
fs.writeFileSync(filePath, restoredHtml, 'utf8');
console.log('✔ produto-26.html normalizado e reconstruído com sucesso!');
