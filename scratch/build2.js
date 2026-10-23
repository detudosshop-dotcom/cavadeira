const fs = require('fs');
const path = require('path');

const file102 = path.join(__dirname, '..', 'pages', 'produto-102.html');
let html = fs.readFileSync(file102, 'utf8');

const jsonScooterStr = fs.readFileSync(path.join(__dirname, 'scooter.json'), 'utf8');

// 1. Substituir IPHONE_MODELS
const regexIphoneModels = /const IPHONE_MODELS = \{[\s\S]*?\n    \};\n\n    let currentModel = '15';/g;
html = html.replace(regexIphoneModels, "const IPHONE_MODELS = " + jsonScooterStr + ";\n\n    let currentModel = 'scooter';");

// 2. Ajustar default gb e cor
html = html.replace(/let currentGB = '128';/, "let currentGB = 'unica';");
html = html.replace(/let currentColor = 'preto';/, "let currentColor = 'preta';");

// 3. Ajustar title, h1, precos, descrição em strings seguras
html = html.replace(/<title>.*?<\/title>/, "<title>Scooter Elétrica TUI 1000w - TUI</title>");
html = html.replace(/<meta name="description".*?>/, '<meta name="description" content="Scooter Elétrica TUI 1000w, bateria 60V, autonomia de 60km. A pronta entrega com desconto!">');
html = html.replace(/<h1 class="product-title" id="product-title-main"[^>]*>.*?<\/h1>/s, '<h1 class="product-title" id="product-title-main" style="margin-top: 12px;">Scooter Elétrica TUI 1000w | 2 Lugares | Sem CNH | Autonomia 60km</h1>');
html = html.replace(/<div class="price-current"><span id="price-display-main">.*?<\/span><\/div>/, '<div class="price-current"><span id="price-display-main">129,90</span></div>');
html = html.replace(/<div class="price-original" id="price-original-main">.*?<\/div>/, '<div class="price-original" id="price-original-main">R$ 2.344,00</div>');
html = html.replace(/<div class="discount-badge-white" id="discount-badge-value">.*?<\/div>/, '<div class="discount-badge-white" id="discount-badge-value">-94%</div>');
html = html.replace(/<span id="discount-badge-ticket">.*?<\/span>/, '<span id="discount-badge-ticket">94% OFF</span>');

// 4. Modal display none
const strModelDisplay = '<div class="variant-option-group" style="display:none;">\\n        <div class="variant-title">Modelo:</div>';
html = html.replace(/<div class="variant-option-group">\s*<div class="variant-title">Modelo:<\/div>/, strModelDisplay);

const strGbDisplay = '<div class="variant-option-group" style="display:none;">\\n        <div class="variant-title">Armazenamento:</div>';
html = html.replace(/<div class="variant-option-group">\s*<div class="variant-title">Armazenamento:<\/div>/, strGbDisplay);

// 5. Atualizar Descrição HTML
const desc = fs.readFileSync(path.join(__dirname, 'desc.txt'), 'utf8');
const descHtml = '<div class="description-text">\\n' + desc.split('\\n').join('<br>') + '\\n</div>';
const replaceDescRegex = /<div class="description-text">[\s\S]*?<\/div>/;
html = html.replace(replaceDescRegex, descHtml);

// 6. Fix textos do carrinho / export
html = html.replace(/pageTitleMain\.textContent = "(.*?)Vitrine Premium.*?";/g, 'pageTitleMain.textContent = "Scooter Elétrica TUI 1000w | 2 Lugares | Sem CNH | Autonomia 60km";');
html = html.replace(/pageTitleMain\.textContent = \`(.*?)Vitrine Premium.*?\`;/g, 'pageTitleMain.textContent = "Scooter Elétrica TUI 1000w | Cor: " + corDef.label;');
html = html.replace(/nome: 'Apple iPhone 15 \/ 15 Plus \/ 15 Pro \/ 15 Pro Max',/, "nome: 'Scooter Elétrica TUI 1000w',");

fs.writeFileSync(file102, html, 'utf8');
console.log("Substituições finalizadas!");
