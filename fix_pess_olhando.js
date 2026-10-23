const fs = require('fs');
const path = require('path');

// 1. Corrigir initPessoasOlhando no js/app.js para usar um número determinístico/pseudo-aleatório baseado no ID do produto
// Isso evita que todos os produtos exibam a mesma quantidade estática de 26 pessoas e 7 unidades
const appJsPath = 'js/app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');

const oldFunc = `// ===== CONTADOR DE PESSOAS OLHANDO (simulado) =====
function initPessoasOlhando() {
  const els = document.querySelectorAll('.pessoas-olhando-count');
  els.forEach(el => {
    const base = parseInt(el.getAttribute('data-base')) || 20;
    function updateCount() {
      const delta = Math.floor(Math.random() * 5) - 2;
      const newVal = Math.max(5, base + Math.floor(Math.random() * 15) + delta);
      el.textContent = newVal;
    }
    setInterval(updateCount, 8000 + Math.random() * 4000);
  });
}`;

const newFunc = `// ===== CONTADOR DE PESSOAS OLHANDO (simulado e dinâmico por produto) =====
function initPessoasOlhando() {
  // Tentar pegar o id do produto da variável global PRODUTO_ATUAL
  const prodId = (typeof PRODUTO_ATUAL !== 'undefined' && PRODUTO_ATUAL.id) ? PRODUTO_ATUAL.id : 42;
  
  // Semente de aleatoriedade baseada no ID do produto para ser consistente
  const seed = (prodId * 7) % 37;
  const basePessoas = 15 + (seed % 25); // Ex: de 15 a 40 pessoas
  const baseUnidades = 3 + (seed % 9);   // Ex: de 3 a 12 unidades

  // Atualizar contadores na tela
  const countEl = document.querySelector('.pessoas-olhando-count');
  if (countEl) {
    countEl.textContent = basePessoas;
    
    // Atualização dinâmica periódica individual
    setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2;
      countEl.textContent = Math.max(5, basePessoas + delta);
    }, 7000 + Math.random() * 3000);
  }

  // Atualizar unidades restantes (procurar o elemento que contém "Restam X unidades")
  const urgencyBar = document.querySelector('.urgency-bar');
  if (urgencyBar) {
    // Achar o elemento <strong> dentro da urgency-bar que não seja a contagem de pessoas
    const strongs = urgencyBar.querySelectorAll('strong');
    strongs.forEach(strong => {
      if (strong !== countEl) {
        strong.textContent = baseUnidades;
      }
    });
  }
}`;

if (appJs.includes(oldFunc)) {
  appJs = appJs.replace(oldFunc, newFunc);
  fs.writeFileSync(appJsPath, appJs, 'utf8');
  console.log('✔ js/app.js atualizado com contagem dinâmica de pessoas e unidades.');
} else {
  // Tenta achar com quebras de linha normalizadas
  const cleanOld = oldFunc.replace(/\r\n/g, '\n');
  const cleanApp = appJs.replace(/\r\n/g, '\n');
  if (cleanApp.includes(cleanOld)) {
    appJs = cleanApp.replace(cleanOld, newFunc);
    fs.writeFileSync(appJsPath, appJs, 'utf8');
    console.log('✔ js/app.js atualizado (quebras de linha normalizadas).');
  } else {
    console.log('⚠️ Não foi possível localizar a assinatura da função antiga no js/app.js');
  }
}
