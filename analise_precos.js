const fs = require('fs');

const catalogo = fs.readFileSync('js/catalogo.js', 'utf8');

// Vamos ler todos os itens e ver quais não tem precoOrig ou tem valores altos suspeitos
const matches = [...catalogo.matchAll(/\{id:(\d+),nome:'([^']+)',preco:([\d\.]+),precoOrig:'([^']*)'/g)];

console.log('--- PRODUTOS SEM PREÇO ANTIGO OU COM VALORES ALTOS ---');
matches.forEach(m => {
  const id = m[1];
  const nome = m[2];
  const preco = parseFloat(m[3]);
  const precoOrig = m[4];

  if (!precoOrig || preco > 150) {
    console.log(`ID: ${id} | Preço: R$ ${preco} | Orig: "${precoOrig}" | Nome: ${nome.slice(0, 50)}...`);
  }
});
