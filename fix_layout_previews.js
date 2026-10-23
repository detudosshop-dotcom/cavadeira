/**
 * fix_layout_previews.js
 * Corrige o aninhamento incorreto das tags de preço (current-price contendo old-price) nos previews de produtos.
 */
const fs = require('fs');
const path = require('path');

function fixHtmlContent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let mudou = false;

  // Regex para achar a tag aninhada incorretamente:
  // <span class="current-price"><span class="currency">R$</span>\s*<span class="old-price">R\$ ([\d\.,]+)</span>\s*([\d\.,]+)</span>
  // E substituir pelo formato correto separado:
  // <span class="current-price"><span class="currency">R$</span> $2</span>
  // <span class="old-price">R$ $1</span>
  
  const nestedRegex = /<span class="current-price"><span class="currency">R\$<\/span>\s*<span class="old-price">R\$ ([\d\.,]+)<\/span>\s*([\d\.,]+)<\/span>/g;
  
  if (nestedRegex.test(content)) {
    content = content.replace(nestedRegex, (match, precoAntigo, precoAtual) => {
      console.log(`  Corrigindo aninhamento no preço: Atual=${precoAtual}, Antigo=${precoAntigo}`);
      return `<span class="current-price"><span class="currency">R$</span> ${precoAtual}</span>\n                    <span class="old-price">R$ ${precoAntigo}</span>`;
    });
    mudou = true;
  }

  // Verificar outra variação possível onde o preço atual vem antes:
  // <span class="current-price"><span class="currency">R$</span> ([\d\.,]+)\s*<span class="old-price">R\$ ([\d\.,]+)</span></span>
  const nestedRegex2 = /<span class="current-price"><span class="currency">R\$<\/span>\s*([\d\.,]+)\s*<span class="old-price">R\$ ([\d\.,]+)<\/span><\/span>/g;
  if (nestedRegex2.test(content)) {
    content = content.replace(nestedRegex2, (match, precoAtual, precoAntigo) => {
      console.log(`  Corrigindo aninhamento variação 2: Atual=${precoAtual}, Antigo=${precoAntigo}`);
      return `<span class="current-price"><span class="currency">R$</span> ${precoAtual}</span>\n                    <span class="old-price">R$ ${precoAntigo}</span>`;
    });
    mudou = true;
  }

  // Corrigir especificamente o rodapé da página que o usuário mencionou no print:
  // "R$ 598,00 Ver carrinho | Frete grátis" no rodapé de checkout/carrinho ou bottom-nav.
  // O print mostra no rodapé: "R$ 598,00 Ver carrinho | Frete grátis". Isso vem do localStorage antigo!
  // Como o usuário já tinha o item de R$ 598,00 adicionado no carrinho do localStorage do navegador dele,
  // ao atualizar os preços, os novos cliques colocarão o preço certo de R$ 79,90,
  // mas o carrinho atual dele ainda tem o preço antigo de R$ 598,00.
  // Para corrigir isso visualmente para o usuário caso ele limpe o carrinho ou adicione novamente,
  // podemos rodar um script rápido de limpeza de carrinho ou deixar o carrinho atualizar dinamicamente.
  
  if (mudou) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✔ Arquivo corrigido: ${path.basename(filePath)}`);
  }
}

// 1. Corrigir index.html
console.log('Analisando index.html...');
fixHtmlContent('index.html');

// 2. Corrigir páginas de produto
console.log('Analisando páginas em /pages...');
const pagesDir = 'pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
files.forEach(f => {
  fixHtmlContent(path.join(pagesDir, f));
});

console.log('Correção concluída!');
