/**
 * fix_all.js - Corrige duplicatas no index.html e o decalque da bicicleta spinning
 */
const fs = require('fs');
const path = require('path');

// =============================================
// 1. REMOVE CARDS DUPLICADOS DO index.html
// =============================================
let html = fs.readFileSync('index.html', 'utf8');

// Linhas dos blocos a remover (verificadas manualmente):
// Bloco linha 742-760: "caixa de som boombox plus" apontando errado para produto-7
// Bloco linha 818-836: "garantia estendida" apontando errado para produto-7
// Os outros dois (ocorrências 3 e 4) são produtos diferentes, não são "duplicatas" do mesmo produto

// Abordagem: remover os cards com data-nome específicos que estão errados
const blocosParaRemover = [
  'data-nome="caixa de som boombox plus com 3 alto-falantes 200w"',
  'data-nome="garantia estendida"',
  'data-nome="caixa de som bluetooth boombox bs-01b 200w ip66"',
];

let removidos = 0;
for (const identificador of blocosParaRemover) {
  // Achar o início do <a> que contém esse identificador
  const pos = html.indexOf(identificador);
  if (pos === -1) {
    console.log(`Não encontrado: ${identificador}`);
    continue;
  }
  // Retroceder para o início do <a>
  const startA = html.lastIndexOf('<a ', pos);
  if (startA === -1) continue;
  
  // Avançar para o </a> correspondente
  const endA = html.indexOf('</a>', pos);
  if (endA === -1) continue;
  
  const bloco = html.slice(startA, endA + 4);
  
  // Verificar se aponta para produto-7.html (só remove se for um link errado)
  if (!bloco.includes('produto-7.html')) {
    console.log(`SKIP (não aponta para produto-7.html): ${identificador}`);
    continue;
  }
  
  console.log(`Removendo bloco: ${identificador.slice(0, 60)}...`);
  html = html.slice(0, startA) + html.slice(endA + 4);
  removidos++;
  console.log(`✔ Removido`);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log(`\n✔ index.html atualizado. ${removidos} cards duplicados/incorretos removidos.\n`);

// =============================================
// 2. VERIFICA O DECALQUE DA BICICLETA (produto-94.html)
// =============================================
const produto94 = fs.readFileSync('pages/produto-94.html', 'utf8');

// Verificar se existe o decalque de desconto e preço antigo
const temPrecoAntigo = produto94.includes('price-old') || produto94.includes('old-price') || produto94.includes('preco-antigo');
const temDesconto = produto94.includes('discount-badge-white') || produto94.includes('price-row');
const temPrecoCorreto = produto94.includes('147,00') || produto94.includes('147.00');

console.log('Verificação produto-94.html:');
console.log('  Tem preço antigo:', temPrecoAntigo);
console.log('  Tem desconto badge:', temDesconto);
console.log('  Tem preço 147,00:', temPrecoCorreto);

// Verificar a seção de preço
const priceSectionMatch = produto94.match(/<!-- SEÇÃO DE PREÇO -->([\s\S]*?)<!-- INFO DO PRODUTO -->/);
if (priceSectionMatch) {
  console.log('\nSeção de preço atual:');
  console.log(priceSectionMatch[1].slice(0, 500));
}
