const fs = require('fs');
const path = require('path');

const file102 = path.join(__dirname, '..', 'pages', 'produto-102.html');
let html = fs.readFileSync(file102, 'utf8');

const jsonScooterStr = fs.readFileSync(path.join(__dirname, 'scooter.json'), 'utf8');

// 1. Substituir IPHONE_MODELS
const splitStart = 'const IPHONE_MODELS = {';
const splitEnd = "let currentModel = '15';";

if (html.includes(splitStart) && html.includes(splitEnd)) {
  const parts1 = html.split(splitStart);
  const beforeModels = parts1[0];
  const parts2 = parts1[1].split(splitEnd);
  const afterModels = parts2[1];
  
  html = beforeModels + 'const IPHONE_MODELS = ' + jsonScooterStr + '\n\n    let currentModel = "scooter";' + afterModels;
}

// 2. Corrigir thumbnails (linha 337-362)
const thumbnailsContainerSplit = '<div id="opcoes-thumbnails-container" style="display: flex; gap: 4px; align-items: center;">';
const endThumbnailsContainerSplit = '<span id="opcoes-count-label"';
if (html.includes(thumbnailsContainerSplit) && html.includes(endThumbnailsContainerSplit)) {
  const tParts1 = html.split(thumbnailsContainerSplit);
  const tBefore = tParts1[0] + thumbnailsContainerSplit + '\n';
  const tParts2 = tParts1[1].split(endThumbnailsContainerSplit);
  const tAfter = '              <span id="opcoes-count-label"';
  
  const novasThumbs = `
                <div style="width:24px; height:24px; border-radius:4px; border:1px solid #ddd; background:#f0f0f0; overflow:hidden; flex-shrink:0;">
                  <img src="../imagemscooterpreta/D_NQ_NP_2X_712059-MLA99509048862_112025-F.webp" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.src='../logo.png'">
                </div>
                <div style="width:24px; height:24px; border-radius:4px; border:1px solid #ddd; background:#f0f0f0; overflow:hidden; flex-shrink:0;">
                  <img src="../imagemscooteramarela/D_NQ_NP_2X_667141-MLA96643803407_102025-F.webp" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.src='../logo.png'">
                </div>
                <div style="width:24px; height:24px; border-radius:4px; border:1px solid #ddd; background:#f0f0f0; overflow:hidden; flex-shrink:0;">
                  <img src="../imagemscooterazul/D_NQ_NP_2X_634494-MLA96644090069_102025-F.webp" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.src='../logo.png'">
                </div>
                <div style="width:24px; height:24px; border-radius:4px; border:1px solid #ddd; background:#f0f0f0; overflow:hidden; flex-shrink:0;">
                  <img src="../imagemscooterbranca/D_NQ_NP_2X_679453-MLA92387568816_092025-F.webp" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.src='../logo.png'">
                </div>
                <div style="width:24px; height:24px; border-radius:4px; border:1px solid #ddd; background:#f0f0f0; overflow:hidden; flex-shrink:0;">
                  <img src="../imagemscooterrosa/D_NQ_NP_2X_638739-MLA99709210702_122025-F.webp" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.src='../logo.png'">
                </div>
              </div>
  `;
  html = tBefore + novasThumbs + tAfter + tParts2.slice(1).join(endThumbnailsContainerSplit);
}

// 3. Remover "segunda.png"
const imgSplice = "images.splice(1, 0, '../img/iphones/segunda.png');";
const imgPush = "images.push('../img/iphones/segunda.png');";
html = html.replace(imgSplice, "// images.splice");
html = html.replace(imgPush, "// images.push");

// 4. Modal price hardcoded original
html = html.replace(/<div class="custom-modal-price" id="modal-price"[\s\S]*?>.*?<\/div>/, '<div class="custom-modal-price" id="modal-price" style="font-size: 20px; font-weight: 800; color: #ff2b56; line-height: 1.2; display: flex; align-items: baseline; gap: 2px;">R$ 129,90</div>');
html = html.replace(/<div class="custom-modal-old-price" id="modal-old-price"[\s\S]*?>.*?<\/div>/, '<div class="custom-modal-old-price" id="modal-old-price" style="font-size: 11px; color: #999; text-decoration: line-through; margin-top: 2px;">R$ 2.344,00</div>');
html = html.replace(/<div class="custom-modal-title" id="modal-title-desc"[\s\S]*?>.*?<\/div>/, '<div class="custom-modal-title" id="modal-title-desc" style="font-size: 13px; font-weight: 500; color: #333; margin-top: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Scooter Elétrica TUI 1000w</div>');

// 5. Garantir precos
html = html.replace(/108,90/g, '129,90');

// 6. Atualizar lógicas JS extras do gb e title
html = html.replace(/let currentGB = '128';/, 'let currentGB = "unica";');
html = html.replace(/let currentColor = 'preto';/, 'let currentColor = "preta";');
html = html.replace(/pageTitleMain\.textContent = "Apple iPhone 15, 15 Plus, 15 Pro e 15 Pro Max \\(Vitrine Premium\\)";/g, 'pageTitleMain.textContent = "Scooter Elétrica TUI 1000w | 2 Lugares | Sem CNH | Autonomia 60km";');
html = html.replace(/pageTitleMain\.textContent = \`\$\{modelDef\.name\}.*?\`;/g, 'pageTitleMain.textContent = `Scooter Elétrica TUI 1000w | 2 Lugares | Cor: ${corDef.label}`;');

// Correções extras percebidas na print:
html = html.replace(/"Apple iPhone 15 \(128 GB\)"/g, '"Scooter Elétrica TUI 1000w"');
html = html.replace(/>Apple iPhone 15 \(128 GB\)</g, '>Scooter Elétrica TUI 1000w<');

fs.writeFileSync(file102, html, 'utf8');
console.log("Correções finais aplicadas!");
