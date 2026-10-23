const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Produtos distintos que apontam para produto-7.html com nomes diferentes
// Precisamos identificar quais são os blocos completos de cada card
// e manter apenas o que realmente é o produto-7 (Caixa de Som AIWA)
// Os outros três são produtos diferentes mapeados erroneamente para produto-7.html

// Verificar a situação:
// - pos 115572: "caixa de som boombox plus com 3 alto-falantes 200w" -> produto errado
// - pos 130437: "garantia estendida" -> produto errado  
// - pos 156354: "caixa de som bluetooth boombox bs-01b 200w ip66" -> produto errado
// - pos 186210: "caixa de som aiwa boombox plus bluetooth ip66" -> PROVAVELMENTE o real produto-7 (Caixa de Som AIWA)

// Vamos extrair os blocos completos ao redor de cada ocorrência
const target = 'produto-7.html';
let idx = html.indexOf(target);
const positions = [];
while (idx !== -1) {
  positions.push(idx);
  idx = html.indexOf(target, idx + 1);
}

console.log('Total de ocorrências:', positions.length);

// Para cada posição, vamos encontrar o bloco completo do card
// O bloco começa com <a class="product-card-rec" e termina com </a>
for (let i = 0; i < positions.length; i++) {
  const p = positions[i];
  // Encontrar início do <a> antes de p
  const startA = html.lastIndexOf('<a ', p);
  // Encontrar o </a> após p
  const endA = html.indexOf('</a>', p) + 4;
  
  console.log(`\n=== Ocorrência ${i + 1} ===`);
  console.log(`Posição: ${p}`);
  console.log(`Bloco (${endA - startA} chars): ${html.slice(startA, startA + 200).replace(/\n/g, ' ').replace(/\s+/g, ' ')}`);
}
