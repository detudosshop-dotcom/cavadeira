const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/eduar/OneDrive/Documentos/TT';

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Famosinhos Shop')) {
      const newContent = content.replace(/Famosinhos Shop/g, 'Stone Shop');
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`[OK] Atualizado: ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.error(`[ERRO] Ao processar ${filePath}:`, err.message);
  }
}

// 1. Processa index.html
processFile(path.join(ROOT, 'index.html'));

// 2. Processa arquivos na pasta pages/
const pagesDir = path.join(ROOT, 'pages');
if (fs.existsSync(pagesDir)) {
  const files = fs.readdirSync(pagesDir);
  files.forEach(file => {
    if (file.endsWith('.html')) {
      processFile(path.join(pagesDir, file));
    }
  });
}

console.log('Substituição de Famosinhos Shop por Stone Shop concluída com sucesso!');
