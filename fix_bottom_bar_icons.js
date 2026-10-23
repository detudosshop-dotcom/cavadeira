/**
 * fix_bottom_bar_icons.js
 * Substitui os SVGs dos botões "Loja" e "Chat" da bottom-bar em todos os arquivos de produto
 * por SVGs idênticos aos da imagem de referência.
 */
const fs = require('fs');
const path = require('path');

const pagesDir = 'pages';
const files = fs.readdirSync(pagesDir).filter(f => f.match(/^produto-\d+\.html$/));

// Novos códigos de SVG
const svgLoja = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Telhado toldo ondulado Shopee Style -->
        <path d="M19 11V10l-1.5-4h-11L5 10v1c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2" />
        <!-- Base da lojinha -->
        <path d="M6 13v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7" />
      </svg>`;

const svgChat = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Balão de Chat Oval com Rabicho da Foto -->
        <path d="M21 11.5c0 4.7-4 8.5-9 8.5-.8 0-1.6-.1-2.4-.3L5 21l1.5-3.8C4.3 15.7 3 13.7 3 11.5 3 6.8 7 3 12 3s9 3.8 9 8.5z" />
      </svg>`;

let totalCorrigidos = 0;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let mudou = false;

  // Localizar o bloco da bottom-bar
  const bottomBarStart = html.indexOf('<div class="bottom-bar">');
  if (bottomBarStart !== -1) {
    const bottomBarEnd = html.indexOf('</div>', bottomBarStart + 100);
    if (bottomBarEnd !== -1) {
      let bottomBarHtml = html.slice(bottomBarStart, bottomBarEnd + 6);
      
      // Substituir o botão de Loja
      // Regex para pegar o botão Loja com qualquer SVG dentro
      const lojaBtnRegex = /<button class="btn-icon-action" aria-label="Loja"[^>]*>([\s\S]*?)Loja\s*<\/button>/;
      const novoLojaBtn = `<button class="btn-icon-action" aria-label="Loja" onclick="window.location.href='../index.html'">
      ${svgLoja}
      Loja
    </button>`;

      // Substituir o botão de Chat
      const chatBtnRegex = /<button class="btn-icon-action" aria-label="Chat"[^>]*>([\s\S]*?)Chat\s*<\/button>/;
      
      // O botão chat precisa continuar funcional abrindo o smart chat!
      const novoChatBtn = `<button class="btn-icon-action" aria-label="Chat" id="product-chat-btn">
      ${svgChat}
      Chat
    </button>`;

      if (lojaBtnRegex.test(bottomBarHtml)) {
        bottomBarHtml = bottomBarHtml.replace(lojaBtnRegex, novoLojaBtn);
        mudou = true;
      }
      if (chatBtnRegex.test(bottomBarHtml)) {
        bottomBarHtml = bottomBarHtml.replace(chatBtnRegex, novoChatBtn);
        mudou = true;
      }

      if (mudou) {
        html = html.slice(0, bottomBarStart) + bottomBarHtml + html.slice(bottomBarEnd + 6);
        fs.writeFileSync(filePath, html, 'utf8');
        totalCorrigidos++;
      }
    }
  }
});

console.log(`✔ Total de arquivos HTML com ícones atualizados: ${totalCorrigidos}`);
