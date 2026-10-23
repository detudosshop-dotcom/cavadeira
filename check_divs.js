const fs = require('fs');
const path = require('path');

// Função para checar balanceamento de divs em um arquivo HTML
function checkDivBalance(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Vamos contar tags div de abertura e fechamento
  const openDivs = (html.match(/<div\b/g) || []).length;
  const closeDivs = (html.match(/<\/div>/g) || []).length;
  
  if (openDivs !== closeDivs) {
    console.log(`⚠️ ${path.basename(filePath)} DESBALANÇADO! Aberturas: ${openDivs} | Fechamentos: ${closeDivs}`);
    return false;
  }
  return true;
}

console.log('--- CHECANDO BALANCEAMENTO DE DIVS ---');
const pagesDir = 'pages';
const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

let desbalancados = [];
files.forEach(f => {
  if (!checkDivBalance(path.join(pagesDir, f))) {
    desbalancados.push(f);
  }
});

console.log('Desbalançados encontrados:', desbalancados);
