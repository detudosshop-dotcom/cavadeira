const fs = require('fs');
const path = require('path');

// Achar qualquer produto HTML que tenha price-section
const dir = fs.readdirSync('pages');
for (const file of dir.slice(0, 20)) {
  if (!file.endsWith('.html') || file === 'produto-94.html') continue;
  const h = fs.readFileSync(path.join('pages', file), 'utf8');
  const ps = h.indexOf('price-section');
  if (ps < 0) continue;
  
  // Pegar bloco maior
  const blockStart = h.lastIndexOf('<div', ps - 1);
  // Encontrar o fechamento da price-section (4 fechamentos de div)
  let depth = 0;
  let pos = blockStart;
  while (pos < h.length && depth >= 0) {
    const openTag = h.indexOf('<div', pos + 1);
    const closeTag = h.indexOf('</div>', pos + 1);
    if (closeTag < 0) break;
    if (openTag > 0 && openTag < closeTag) {
      depth++;
      pos = openTag;
    } else {
      depth--;
      pos = closeTag;
    }
    if (depth < 0) break;
  }
  
  const bloco = h.slice(blockStart, pos + 6);
  console.log(`=== ${file} ===`);
  console.log(bloco);
  console.log();
  break;
}
