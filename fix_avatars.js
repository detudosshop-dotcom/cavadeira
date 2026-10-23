/**
 * fix_avatars.js
 * Corrige a letra do avatar (review-avatar-placeholder) para corresponder
 * à primeira letra do nome do usuário (review-user-name) em TODOS os produtos.
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

let totalCorrigidos = 0;
let arquivosAlterados = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  let mudou = false;
  let localCount = 0;
  
  // Estratégia: procurar o padrão completo do bloco avatar + nome
  // Padrão: review-avatar-placeholder">LETRA</div></div>
  //         ...
  //         review-user-name">NOME</div>
  
  // Usar regex que captura a letra atual e o nome, e substitui a letra pelo initial do nome
  // O bloco tem estrutura: review-avatar-placeholder">X</div></div>\n...\n review-user-name">NOME</div>
  
  const re = /(<div class="review-avatar-placeholder">)([A-ZÀ-Úa-zà-ú])([\s\S]{0,400}?class="review-user-name">)([A-ZÀ-ÚÃÃa-zA-ZÀ-Ú][^\n<]{1,60}?)(<\/div>)/g;
  
  html = html.replace(re, (match, openPlaceholder, currentLetter, middle, name, closeTag) => {
    const nomeLimpo = name.trim();
    if (!nomeLimpo) return match;
    
    const primeiraLetra = nomeLimpo[0].toUpperCase();
    
    if (currentLetter !== primeiraLetra) {
      localCount++;
      mudou = true;
      return openPlaceholder + primeiraLetra + middle + nomeLimpo + closeTag;
    }
    
    return match;
  });
  
  if (mudou) {
    fs.writeFileSync(filePath, html, 'utf8');
    arquivosAlterados++;
    totalCorrigidos += localCount;
    console.log(`  ${file}: ${localCount} avatares corrigidos`);
  }
}

console.log('\n========================================');
console.log(`✔ Total de avatares corrigidos: ${totalCorrigidos}`);
console.log(`✔ Arquivos modificados: ${arquivosAlterados}`);
console.log('========================================');
