/**
 * fix_all_remnants.js
 * Substitui os preços antigos nas tags meta e na seção de produtos relacionados
 * de todos os produtos do catálogo.
 */
const fs = require('fs');
const path = require('path');

const pagesDir = 'pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const correcoes = [
  { id: 92, antigo: '598,00', novo: '79,90' },
  { id: 33, antigo: '369,00', novo: '59,90' },
  { id: 91, antigo: '643,08', novo: '79,90' },
  { id: 88, antigo: '170,05', novo: '69,90' }
];

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let mudou = false;

  // 1. Substituir nos relacionados: href="produto-ID.html" ... <span class="related-price">R$ ANTIGO</span>
  correcoes.forEach(c => {
    // Procura o bloco relacionado do respectivo produto
    const link = `href="produto-${c.id}.html"`;
    let startIdx = html.indexOf(link);
    while (startIdx !== -1) {
      const endCardIdx = html.indexOf('</a>', startIdx);
      if (endCardIdx !== -1) {
        let cardHtml = html.slice(startIdx, endCardIdx);
        
        // Substituir o preço dentro desse card específico
        const precoOld = `R$ ${c.antigo}`;
        const precoNovo = `R$ ${c.novo}`;
        if (cardHtml.includes(precoOld)) {
          cardHtml = cardHtml.replace(precoOld, precoNovo);
          html = html.slice(0, startIdx) + cardHtml + html.slice(endCardIdx);
          mudou = true;
        }
      }
      startIdx = html.indexOf(link, startIdx + 1);
    }
    
    // 2. Substituir na meta description do próprio produto
    if (file === `produto-${c.id}.html`) {
      const metaRegex = new RegExp(`Apenas R\\$${c.antigo.replace(',', '\\,')}`);
      if (metaRegex.test(html)) {
        html = html.replace(metaRegex, `Apenas R$${c.novo}`);
        mudou = true;
      }
    }
  });

  if (mudou) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✔ Remanescentes corrigidos em: ${file}`);
  }
});

console.log('Varredura completa concluída!');
