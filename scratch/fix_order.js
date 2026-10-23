const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'pages', 'produto-102.html');
let content = fs.readFileSync(targetPath, 'utf8');

// O mapeamento das imagens corretas para cada cor (apenas o nome do arquivo, que é o que precisamos puxar pra primeira posição)
const frontImages = {
  amarela: 'D_NQ_NP_2X_923365-MLA92387512050_092025-F.webp',
  azul: 'D_NQ_NP_2X_921899-MLA96881158875_102025-F.webp',
  branca: 'D_NQ_NP_2X_828166-MLA92387510116_092025-F.webp',
  bronze: 'D_NQ_NP_2X_844157-MLA85005032064_052025-F.webp',
  cinzaescuro: 'D_NQ_NP_2X_715619-MLA99963838091_112025-F.webp',
  laranja: 'D_NQ_NP_2X_817034-MLA99992146087_112025-F.webp',
  prateada: 'D_NQ_NP_2X_870206-MLA107320455426_032026-F.webp',
  preta: 'D_NQ_NP_2X_712059-MLA99509048862_112025-F.webp',
  rosa: 'D_NQ_NP_2X_638739-MLA99709210702_122025-F.webp',
  verde: 'D_NQ_NP_2X_623929-MLA96644162415_102025-F.webp',
  verdelimao: 'D_NQ_NP_2X_632466-MLA91559662092_092025-F.webp',
  vermelha: 'D_NQ_NP_2X_982468-MLA99991189235_112025-F.webp'
};

// Processar cada cor e seu bloco de imagens
for (const [cor, frontImg] of Object.entries(frontImages)) {
  // Regex para achar o bloco da cor. Exemplo: amarela: { label: 'Amarela', vendas: '7.653', images: [ ... ]},
  const regex = new RegExp(`(${cor}:\\s*\\{[^\\}]*images:\\s*\\[)([^\\]]+)(\\]\\})`, 'g');
  
  content = content.replace(regex, (match, prefix, imagesStr, suffix) => {
    // Transforma a string de imagens num array de strings
    let imgArray = imagesStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    // Procura o index da imagem que queremos
    const targetIndex = imgArray.findIndex(img => img.includes(frontImg));
    
    if (targetIndex > -1) {
      // Remove a imagem do local atual
      const targetElement = imgArray.splice(targetIndex, 1)[0];
      // Adiciona na primeira posição
      imgArray.unshift(targetElement);
    }
    
    // Remonta a string de imagens com as quebras de linha bonitinhas originais
    const newImagesStr = '\\n            ' + imgArray.join(',\\n            ') + '\\n          ';
    return prefix + newImagesStr + suffix;
  });
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Ordem das imagens atualizada com sucesso no arquivo produto-102.html!');
