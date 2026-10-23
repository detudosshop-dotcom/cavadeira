/**
 * sync_previews.js
 * Sincroniza os preços nos cards estáticos em index.html e em todas as páginas de produto.
 */
const fs = require('fs');
const path = require('path');

const targets = [
  { id: 92, precoStr: '79,90', precoOldStr: '597,90', regexSearch: /pages\/produto-92\.html/ },
  { id: 33, precoStr: '59,90', precoOldStr: '397,80', regexSearch: /pages\/produto-33\.html/ },
  { id: 91, precoStr: '79,90', precoOldStr: '647,90', regexSearch: /pages\/produto-91\.html/ },
  { id: 88, precoStr: '69,90', precoOldStr: '397,80', regexSearch: /pages\/produto-88\.html/ }
];

function processFile(filePath, isRoot = false) {
  let content = fs.readFileSync(filePath, 'utf8');
  let mudou = false;

  targets.forEach(t => {
    // Para index.html os links são "pages/produto-X.html", para páginas dentro de pages os links são "produto-X.html"
    const linkPath = isRoot ? `pages/produto-${t.id}.html` : `produto-${t.id}.html`;
    const startIdx = content.indexOf(`href="${linkPath}"`);
    
    if (startIdx !== -1) {
      // Achar o fechamento do card </a>
      const endIdx = content.indexOf('</a>', startIdx);
      if (endIdx !== -1) {
        let cardBlock = content.slice(startIdx, endIdx);
        
        // Substituir preço atual no card
        const currentPriceRegex = /<span class="current-price"><span class="currency">R\$<\/span>\s*[\d\.,]+<\/span>/;
        const novoCurrentPrice = `<span class="current-price"><span class="currency">R$</span> ${t.precoStr}</span>`;
        
        if (currentPriceRegex.test(cardBlock)) {
          cardBlock = cardBlock.replace(currentPriceRegex, novoCurrentPrice);
          mudou = true;
        }

        // Adicionar/substituir o preço antigo
        const oldPriceRegex = /<span class="old-price">[^<]*<\/span>/;
        const novoOldPrice = `<span class="old-price">R$ ${t.precoOldStr}</span>`;
        
        if (oldPriceRegex.test(cardBlock)) {
          cardBlock = cardBlock.replace(oldPriceRegex, novoOldPrice);
          mudou = true;
        } else {
          // Se não tiver a tag de preço antigo, insere após o current-price
          const priceBlockRegex = /(<div class="product-price">[\s\S]*?<\/span>)/;
          if (priceBlockRegex.test(cardBlock)) {
            cardBlock = cardBlock.replace(priceBlockRegex, `$1\n                    ${novoOldPrice}`);
            mudou = true;
          }
        }
        
        content = content.slice(0, startIdx) + cardBlock + content.slice(endIdx);
      }
    }
  });

  if (mudou) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✔ Card(s) sincronizado(s) em: ${path.basename(filePath)}`);
  }
}

// 1. Processar index.html
processFile('index.html', true);

// 2. Processar todas as páginas de produto
const pagesDir = 'pages';
const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

files.forEach(f => {
  processFile(path.join(pagesDir, f), false);
});

console.log('Sincronização de previews concluída!');
