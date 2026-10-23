const fs = require('fs');
const path = require('path');
const dir = 'pages';
const files = fs.readdirSync(dir).filter(f => f.match(/^produto/));

// Verificar avaliações que têm classe review-comment mas texto muito curto (menos de 10 chars)
let totalCurtos = 0;

for (const f of files) {
  const h = fs.readFileSync(path.join(dir, f), 'utf8');
  
  // Extrair todos os review-comment
  const commentRe = /class="review-comment">([\s\S]*?)<\/div>/g;
  let m;
  let curtos = 0;
  const exemplos = [];
  
  while ((m = commentRe.exec(h)) !== null) {
    const text = m[1].trim();
    if (text.length < 20) {
      curtos++;
      exemplos.push(JSON.stringify(text.slice(0, 50)));
    }
  }
  
  if (curtos > 0) {
    console.log(f + ': ' + curtos + ' comentários curtos (< 20 chars)');
    exemplos.slice(0, 3).forEach(e => console.log('  Exemplo:', e));
  }
  
  totalCurtos += curtos;
}

console.log('\nTotal de comentários curtos/vazios:', totalCurtos);
