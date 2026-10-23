/**
 * rebuild_produto26.js
 * Desembaralha o produto-26.html movendo a seção de relacionados e as tags de fechamento
 * para o final das avaliações, restaurando o layout correto de celular.
 */
const fs = require('fs');

const filePath = 'pages/produto-26.html';
if (!fs.existsSync(filePath)) {
  console.log('Arquivo produto-26.html não encontrado.');
  process.exit(1);
}

let html = fs.readFileSync(filePath, 'utf8');

// 1. Extrair a related-section que está no meio das avaliações
const relatedStart = html.indexOf('<!-- PRODUTOS RELACIONADOS -->');
const relatedEnd = html.indexOf('</div>\n      </div>\n\n    </div><!-- fim product-info -->'); // Fechamento da related-section

if (relatedStart === -1 || relatedEnd === -1) {
  console.log('Não foi possível localizar a related-section deslocada.');
  process.exit(1);
}

// O bloco da related-section completo
const relatedBlock = html.slice(relatedStart, relatedEnd + 21); // inclui os fechamentos de grid e section

// Remove a related-section e as tags extras de fechamento do meio do arquivo
// Também remove o fechamento de mais-reviews e reviews-section que estavam truncados ali
const cleanHtml = html.slice(0, relatedStart) + html.slice(relatedEnd + 21);

// Agora vamos re-processar o HTML limpo
// Procuramos todas as avaliações no arquivo.
// O arquivo tem:
//   - Abertura de mais-reviews-26 na linha 287: <div id="mais-reviews-26" style="display:none">
//   - As avaliações continuam até o final.
//   - No final de tudo, antes da bottom-bar, nós devemos fechar a mais-reviews-26 (</div>),
//     colocar o botão "Ver mais", fechar a reviews-section (</div>), colocar a related-section,
//     fechar a product-info (</div>), fechar a page-content (</div>).

// Vamos achar o início da bottom-bar
const bottomBarIndex = cleanHtml.indexOf('<!-- BOTTOM BAR -->');
if (bottomBarIndex === -1) {
  console.log('Não foi possível localizar a bottom-bar.');
  process.exit(1);
}

const beforeBottomBar = cleanHtml.slice(0, bottomBarIndex);
const bottomBarAndRest = cleanHtml.slice(bottomBarIndex);

// Vamos limpar qualquer tag residual de fechamento que tenha ficado antes da bottom-bar
// (como os fechamentos incorretos de product-info e page-content que estavam deslocados)
let cleanBeforeBottomBar = beforeBottomBar.trim();

// Certificar que removemos os fechamentos errados de product-info / page-content no final das avaliações
cleanBeforeBottomBar = cleanBeforeBottomBar.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<!-- fim product-info -->\s*<\/div>\s*<!-- fim page-content -->/, '');
// E se sobrou algo similar:
cleanBeforeBottomBar = cleanBeforeBottomBar.replace(/<\/div>\s*<!-- fim product-info -->\s*<\/div>\s*<!-- fim page-content -->/, '');

// Agora montamos de forma estruturada:
const finalHtml = cleanBeforeBottomBar + `
        </div> <!-- fim mais-reviews-26 -->
        <button class="ver-mais-btn" id="ver-mais-btn-26" onclick="verMaisReviews('mais-reviews-26','ver-mais-btn-26',51)">Ver mais avaliações (51 restantes) ›</button>
      </div> <!-- fim reviews-section -->

      ${relatedBlock}

    </div><!-- fim product-info -->
  </div><!-- fim page-content -->

` + bottomBarAndRest;

fs.writeFileSync(filePath, finalHtml, 'utf8');
console.log('✔ produto-26.html reconstruído e desembaralhado com sucesso!');
