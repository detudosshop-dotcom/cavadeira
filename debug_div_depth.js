const fs = require('fs');
const html = fs.readFileSync('pages/produto-26.html', 'utf8');

const lines = html.split('\n');
let depth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let m;
  const lineDivRegex = /(<\/div>|<div\b[^>]*>)/g;
  
  while ((m = lineDivRegex.exec(line)) !== null) {
    const tag = m[1];
    if (tag.startsWith('</')) {
      depth--;
      if (depth < 0) {
        console.log(`❌ ERRO: div fechada a mais na linha ${i + 1}: ${line.trim()}`);
        depth = 0; // reset
      }
    } else {
      depth++;
    }
  }
}
