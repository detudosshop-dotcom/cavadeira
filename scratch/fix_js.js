const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'pages', 'produto-102.html');
let html = fs.readFileSync(file, 'utf8');

// Regex para encontrar onde quebrou:
// track.style.transform = `translateX(0px)`;
//       // 2. Atualizar preços principais da página (Preço laranja do banner e preço original)

const searchFor = `      // Reinicia a posição de scroll para a primeira foto
      track.style.transform = \`translateX(0px)\`;
      // 2. Atualizar preços principais da página (Preço laranja do banner e preço original)`;

const replacement = `      // Reinicia a posição de scroll para a primeira foto
      track.style.transform = \`translateX(0px)\`;

      // Recarrega dots e contador
      initSlider();
    }

    // ===================== FUNÇÃO DE SINCRONIZAÇÃO DA PÁGINA COM O MODAL =====================
    function updatePageDetails() {
      const modelDef = IPHONE_MODELS[currentModel];
      const corDef = modelDef.cores[currentColor];
      const gbDef = modelDef.gb[currentGB];
      if (!modelDef || !corDef || !gbDef) return;

      // 1. Atualizar dinamicamente o título principal da página
      const pageTitleMain = document.getElementById('product-title-main');
      if (pageTitleMain) {
        if (!userInteracted) {
          pageTitleMain.textContent = "Scooter Elétrica TUI 1000w | 2 Lugares | Sem CNH | Autonomia 60km";
        } else {
          pageTitleMain.textContent = \`\${modelDef.name} – Cor: \${corDef.label}\`;
        }
      }

      // 2. Atualizar preços principais da página (Preço laranja do banner e preço original)`;

if (html.includes(searchFor)) {
  html = html.replace(searchFor, replacement);
  fs.writeFileSync(file, html, 'utf8');
  console.log('Função restaurada com sucesso!');
} else {
  // Try with \r\n
  const searchLF = searchFor.replace(/\n/g, '\r\n');
  if (html.includes(searchLF)) {
    html = html.replace(searchLF, replacement);
    fs.writeFileSync(file, html, 'utf8');
    console.log('Função restaurada (CRLF) com sucesso!');
  } else {
    // Try regex whitespace agnostic
    const regex = /track\.style\.transform = `translateX\(0px\)`;[\s]*\/\/ 2\. Atualizar preços principais/;
    if (regex.test(html)) {
      html = html.replace(regex, `track.style.transform = \`translateX(0px)\`;\n\n      // Recarrega dots e contador\n      initSlider();\n    }\n\n    // ===================== FUNÇÃO DE SINCRONIZAÇÃO DA PÁGINA COM O MODAL =====================\n    function updatePageDetails() {\n      const modelDef = IPHONE_MODELS[currentModel];\n      const corDef = modelDef.cores[currentColor];\n      const gbDef = modelDef.gb[currentGB];\n      if (!modelDef || !corDef || !gbDef) return;\n\n      // 1. Atualizar dinamicamente o título principal da página\n      const pageTitleMain = document.getElementById('product-title-main');\n      if (pageTitleMain) {\n        if (!userInteracted) {\n          pageTitleMain.textContent = "Scooter Elétrica TUI 1000w | 2 Lugares | Sem CNH | Autonomia 60km";\n        } else {\n          pageTitleMain.textContent = \`\${modelDef.name} – Cor: \${corDef.label}\`;\n        }\n      }\n\n      // 2. Atualizar preços principais`);
      fs.writeFileSync(file, html, 'utf8');
      console.log('Função restaurada (Regex) com sucesso!');
    } else {
      console.log('FALHA: Bloco não encontrado no arquivo.');
    }
  }
}
