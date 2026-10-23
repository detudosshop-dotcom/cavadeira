const fs = require('fs');
const h = fs.readFileSync('pages/produto-94.html', 'utf8');
// Achar links CSS
const cssLinks = [];
let start = 0;
while (true) {
  const href = h.indexOf('href="', start);
  if (href < 0) break;
  const end = h.indexOf('"', href + 6);
  const link = h.slice(href + 6, end);
  if (link.includes('.css')) cssLinks.push(link);
  start = end + 1;
}
console.log('CSS links:', cssLinks);

// Verificar se original_index.css tem price-old
const cssFile = fs.readFileSync('css/original_index.css', 'utf8');
const hasPO = cssFile.indexOf('price-old') > -1;
console.log('original_index.css tem price-old:', hasPO);

// Verificar se produto.css existe e tem price-old
const prodCss = fs.existsSync('css/produto.css') ? fs.readFileSync('css/produto.css', 'utf8') : '';
const hasPO2 = prodCss.indexOf('price-old') > -1;
console.log('produto.css tem price-old:', hasPO2);

// Mostrar todos os CSS files
const files = fs.readdirSync('css');
console.log('CSS files:', files);
