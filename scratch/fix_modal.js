const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'pages', 'produto-102.html');
let html = fs.readFileSync(file, 'utf8');

// Regex para encontrar de <div class="custom-modal-price" até <!-- Quantidade --> (cobrindo a quebra acidental)
const regex = /<div class="custom-modal-price"[\s\S]*?<!-- Quantidade -->/m;

const replacement = `<div class="custom-modal-price" id="modal-price"
            style="font-size: 20px; font-weight: 800; color: #ff2b56; line-height: 1.2; display: flex; align-items: baseline; gap: 2px;">
            R$ 129,90</div>
          <div class="custom-modal-old-price" id="modal-old-price"
            style="font-size: 11px; color: #999; text-decoration: line-through; margin-top: 2px;">R$ 2.344,00</div>
          <div class="custom-modal-title" id="modal-title-desc"
            style="font-size: 13px; font-weight: 500; color: #333; margin-top: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            Scooter Elétrica TUI 1000w</div>
        </div>
      </div>

      <!-- SELETOR DE MODELO (oculto) -->
      <div class="variant-option-group" style="display:none;">
        <div class="variant-title">Modelo:</div>
        <div class="variant-buttons" id="model-buttons-container">
          <div class="variant-btn selected" onclick="selectModel('scooter')" id="btn-model-scooter">Scooter TUI</div>
        </div>
      </div>

      <!-- SELETOR DE COR -->
      <div class="variant-option-group">
        <div class="variant-title">Cor: <span id="selected-color-label" style="color:#ff2b56; font-size:13px;"></span>
        </div>
        <div class="variant-buttons" id="color-buttons-container">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>

      <!-- SELETOR DE ARMAZENAMENTO (oculto) -->
      <div class="variant-option-group" style="display:none;">
        <div class="variant-title">Armazenamento:</div>
        <div class="variant-buttons" id="gb-buttons-container">
          <!-- Oculto -->
        </div>
      </div>

      <!-- Quantidade -->`;

if (regex.test(html)) {
  html = html.replace(regex, replacement);
  fs.writeFileSync(file, html, 'utf8');
  console.log('Modal arrumado com sucesso!');
} else {
  console.log('FALHA ao achar regex no arquivo');
}
