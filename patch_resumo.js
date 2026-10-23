const fs = require('fs');
const srcPath = 'C:\\\\Users\\\\eduar\\\\OneDrive\\\\Documentos\\\\TT\\\\pages\\\\resumo.html';
const destPath = 'C:\\\\Users\\\\eduar\\\\OneDrive\\\\Documentos\\\\TT - Standard 2\\\\pages\\\\resumo.html';

const src = fs.readFileSync(srcPath, 'utf8');
let target = fs.readFileSync(destPath, 'utf8');

// Extract HTML
const bumpHtmlStart = src.indexOf('<!-- ORDER BUMP -->');
const bumpHtmlEnd = src.indexOf('<!-- CUPONS & BÔNUS DO TIKTOK SHOP -->', bumpHtmlStart);
const bumpHtml = src.substring(bumpHtmlStart, bumpHtmlEnd);

// Inject HTML
target = target.replace('<!-- CUPONS & BÔNUS DO TIKTOK SHOP -->', bumpHtml + '<!-- CUPONS & BÔNUS DO TIKTOK SHOP -->');

// Extract JS
const bumpJsStart = src.indexOf('function checkOrderBump() {');
const bumpJsEnd = src.indexOf('function calcTotal() {', bumpJsStart);
const bumpJs = src.substring(bumpJsStart, bumpJsEnd);

// Inject JS
target = target.replace('function calcTotal() {', bumpJs + 'function calcTotal() {');

// Inject checkOrderBump call in renderItens
target = target.replace('section.innerHTML = html;\r\n  }', 'section.innerHTML = html;\r\n    if(typeof checkOrderBump === "function") checkOrderBump();\r\n  }');
target = target.replace('section.innerHTML=html;\r\n}', 'section.innerHTML=html;\r\n  if(typeof checkOrderBump === "function") checkOrderBump();\r\n}');
target = target.replace('section.innerHTML = html;\n  }', 'section.innerHTML = html;\n    if(typeof checkOrderBump === "function") checkOrderBump();\n  }');

fs.writeFileSync(destPath, target);
console.log('Done patch!');
