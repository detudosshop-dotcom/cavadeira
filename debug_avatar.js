const fs = require('fs');
const h = fs.readFileSync('pages/produto-94.html', 'utf8');

const PLACEHOLDER = 'review-avatar-placeholder">';
const NOME_TAG = 'review-user-name">';

let pos = 0;
let ok = 0;
let erros = 0;

while (pos < h.length) {
  const pPos = h.indexOf(PLACEHOLDER, pos);
  if (pPos < 0) break;
  
  const letraStart = pPos + PLACEHOLDER.length;
  const letraEnd = h.indexOf('<', letraStart);
  const letra = h.slice(letraStart, letraEnd).trim();
  
  // Procurar o nome logo depois (dentro de ~500 chars)
  const nomeTagPos = h.indexOf(NOME_TAG, letraEnd);
  if (nomeTagPos > letraEnd + 500) {
    pos = letraEnd + 1;
    continue;
  }
  
  const nomeStart = nomeTagPos + NOME_TAG.length;
  const nomeEnd = h.indexOf('<', nomeStart);
  const nome = h.slice(nomeStart, nomeEnd).trim();
  
  if (nome && letra) {
    const esperado = nome[0].toUpperCase();
    if (letra === esperado) {
      ok++;
    } else {
      erros++;
      console.log(`ERRO: avatar="${letra}" mas nome="${nome}" (esperado: "${esperado}")`);
    }
  }
  
  pos = nomeEnd + 1;
}

console.log('\nOK:', ok, '| Erros:', erros);
