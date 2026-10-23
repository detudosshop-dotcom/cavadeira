// Script para corrigir o img dos produtos que têm vídeo .mp4 como imagem principal
// Substitui pelo primeiro item de `imagens[]` que seja uma imagem real

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('produto-') && f.endsWith('.html'));

let corrigidos = 0;
let ignorados = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Procura o bloco PRODUTO_ATUAL
  const produtoMatch = content.match(/const PRODUTO_ATUAL\s*=\s*\{([\s\S]*?)\};\s*\n/);
  if (!produtoMatch) {
    ignorados++;
    continue;
  }

  // Verifica se o img atual é um mp4
  const imgMatch = content.match(/img:\s*'([^']+)'/);
  if (!imgMatch) {
    ignorados++;
    continue;
  }

  const imgAtual = imgMatch[1];
  if (!imgAtual.endsWith('.mp4')) {
    ignorados++;
    continue;
  }

  // Pega a lista de imagens
  const imagensMatch = content.match(/imagens:\s*\[([^\]]+)\]/);
  if (!imagensMatch) {
    ignorados++;
    continue;
  }

  // Extrai todas as URLs do array imagens
  const imagensStr = imagensMatch[1];
  const urls = imagensStr.match(/"([^"]+)"/g);
  if (!urls) {
    ignorados++;
    continue;
  }

  // Encontra a primeira URL que NÃO seja mp4
  const primeiraImagem = urls.find(u => !u.replace(/"/g, '').endsWith('.mp4'));
  if (!primeiraImagem) {
    console.log(`⚠️  ${file}: sem imagem real disponível, mantendo mp4`);
    ignorados++;
    continue;
  }

  const novaImg = primeiraImagem.replace(/"/g, '');

  // Substitui o img: 'URL_MP4' pelo img correto
  const novoContent = content.replace(
    /img:\s*'[^']+\.mp4'/,
    `img: '${novaImg}'`
  );

  if (novoContent !== content) {
    fs.writeFileSync(filePath, novoContent, 'utf8');
    console.log(`✅ ${file}: ${imgAtual.substring(0, 60)}... → ${novaImg.substring(0, 60)}...`);
    corrigidos++;
  } else {
    ignorados++;
  }
}

console.log(`\n📊 Resultado: ${corrigidos} produtos corrigidos, ${ignorados} ignorados.`);
