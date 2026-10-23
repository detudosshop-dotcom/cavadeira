const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Achar todos os hrefs de product-card-rec
const re = /href="pages\/(produto-[\d]+\.html)"/g;
let m;
const hrefs = [];
while ((m = re.exec(html)) !== null) {
  hrefs.push(m[1]);
}

// Encontrar duplicados
const seen = new Set();
const dupes = [];
for (const h of hrefs) {
  if (seen.has(h)) {
    if (!dupes.includes(h)) dupes.push(h);
  } else {
    seen.add(h);
  }
}

console.log('Total de cards no index.html:', hrefs.length);
console.log('Hrefs duplicados encontrados:', dupes.length);
if (dupes.length > 0) {
  console.log('Lista de duplicados:', dupes.join(', '));
} else {
  console.log('Nenhum href duplicado encontrado no index.html');
}

// Verificar duplicatas no catalogo.js pelo nome
const catalogo = fs.readFileSync('js/catalogo.js', 'utf8');
const nomeRe = /nome:'([^']+)'/g;
const nomes = [];
let nm;
while ((nm = nomeRe.exec(catalogo)) !== null) {
  nomes.push(nm[1]);
}
const seenNomes = new Set();
const nomeDupes = [];
for (const n of nomes) {
  const norm = n.trim().toLowerCase().replace(/\s+/g, ' ');
  if (seenNomes.has(norm)) {
    nomeDupes.push(n);
  } else {
    seenNomes.add(norm);
  }
}
console.log('\nNomes duplicados no catalogo.js:', nomeDupes.length);
if (nomeDupes.length > 0) console.log(nomeDupes);
