const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const root = path.join(__dirname, '..');
const dirs = ['imagemscooterpreta', 'imagemscooteramarela', 'imagemscooterazul', 'imagemscooterbranca', 'imagemscooterbronze', 'imagemscootercinzaescuro', 'imagemscooterlaranja', 'imagemscooterprateado', 'imagemscooterrosa', 'imagemscooterverde', 'imagemscooterverdelimao', 'imagemscootervermelho'];

let html = '<html><body style="background:#fff; margin:0; padding:10px;">';
html += '<h1 style="text-align:center;">FOTOS SCOOTER</h1>';
html += '<div style="display:flex; flex-direction:column; gap:20px;">';

dirs.forEach(dir => {
  const fullPath = path.join(root, dir);
  if (!fs.existsSync(fullPath)) return;
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.webp') || f.endsWith('.png'));
  
  html += `<div style="border: 2px solid #ccc; padding: 10px;">`;
  html += `<h2 style="margin: 0 0 10px 0;">COR: ${dir}</h2>`;
  html += `<div style="display:flex; flex-wrap:wrap; gap:10px;">`;
  
  files.forEach((file, index) => {
    // Usamos caminhos absolutos file://...
    html += `<div style="text-align:center;">
        <img src="file://${path.join(fullPath, file).replace(/\\/g, '/')}" style="width:120px; height:120px; object-fit:contain; border:1px solid #aaa;" />
        <div style="font-weight:bold; font-size:20px; color:red;">[${index}]</div>
      </div>`;
  });
  html += `</div></div>`;
});

html += '</div></body></html>';

const htmlPath = path.join(root, 'scratch', 'galeria_visao.html');
fs.writeFileSync(htmlPath, html);

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 4000 }); // Altura grande para caber todas as cores
  await page.goto('file://' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  
  const shotPath = path.join(root, 'scratch', 'visao_completa.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  await browser.close();
  console.log('SCREENSHOT_CRIADO:', shotPath);
})();
