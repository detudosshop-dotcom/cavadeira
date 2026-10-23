const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'pages', 'produto-102.html');
let html = fs.readFileSync(file, 'utf8');

// Thumbnails
const oldThumbs = [
  '../img/iphones/15/preto/1.png',
  '../img/iphones/15/azul/1.png',
  '../img/iphones/15/verde/1.png',
  '../img/iphones/15/amarelo/1.png',
  '../img/iphones/15/rosa/1.png'
];
const newThumbs = [
  '../imagemscooterpreta/D_NQ_NP_2X_712059-MLA99509048862_112025-F.webp',
  '../imagemscooteramarela/D_NQ_NP_2X_667141-MLA96643803407_102025-F.webp',
  '../imagemscooterazul/D_NQ_NP_2X_634494-MLA96644090069_102025-F.webp',
  '../imagemscooterbranca/D_NQ_NP_2X_679453-MLA92387568816_092025-F.webp',
  '../imagemscooterrosa/D_NQ_NP_2X_638739-MLA99709210702_122025-F.webp'
];
oldThumbs.forEach((t, i) => { html = html.split(t).join(newThumbs[i]); });
html = html.split('5 opções').join('12 opções');

// Modal header img
html = html.split('src="" alt="iPhone 15 Series"').join('src="../imagemscooterpreta/D_NQ_NP_2X_712059-MLA99509048862_112025-F.webp" alt="Scooter TUI"');
// Modal price
html = html.split('R$ 108,90</div>').join('R$ 129,90</div>');
// Modal old price
html = html.split('R$ 2.314,40</div>').join('R$ 2.344,00</div>');
// Modal title
html = html.split('Apple iPhone 15</div>').join('Scooter Elétrica TUI 1000w</div>');

// Modal selector - hide modelo and armazenamento, show only cor
html = html.split('<div class="variant-option-group">\n        <div class="variant-title">Modelo:</div>').join('<div class="variant-option-group" style="display:none;">\n        <div class="variant-title">Modelo:</div>');
html = html.split('<div class="variant-option-group">\n        <div class="variant-title">Armazenamento:</div>').join('<div class="variant-option-group" style="display:none;">\n        <div class="variant-title">Armazenamento:</div>');

// Remove segunda.png injection
html = html.split("images.splice(1, 0, '../img/iphones/segunda.png');").join("// segunda.png removida");
html = html.split("images.push('../img/iphones/segunda.png');").join("// segunda.png removida");

// Substituir IPHONE_MODELS inteiro - localiza inicio e fim
const modelsStart = "// ===================== DEFINIÇÕES DA LINHA IPHONE 15 =====================\r\n    const IPHONE_MODELS = {";
const modelsEnd = "    let currentModel = '15';\r\n    let currentColor = 'preto';\r\n    let currentGB = '128';\r\n    let currentQty = 1;\r\n    let currentFlux = 'cart';\r\n    let userInteracted = false;\r\n    let inicializacaoConcluida = false;\r\n\r\n    // PRODUTO_ATUAL para exportação do carrinho\r\n    const PRODUTO_ATUAL = {\r\n      id: 100,\r\n      nome: 'Apple iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max',\r\n      preco: 95.90,\r\n      img: ''\r\n    };";

const newModels = `// ===================== DEFINIÇÕES DA SCOOTER ELÉTRICA TUI 1000W =====================
    const IPHONE_MODELS = {
      'scooter': {
        name: 'Scooter Elétrica TUI 1000w',
        basePrice: 129.90,
        basePriceOrig: 2344.00,
        cores: {
          preta: { label: 'Preta', vendas: '10.841', images: [
            '../imagemscooterpreta/D_NQ_NP_2X_712059-MLA99509048862_112025-F.webp',
            '../imagemscooterpreta/D_NQ_NP_2X_725757-MLA106965946098_022026-F.webp',
            '../imagemscooterpreta/D_NQ_NP_2X_735269-MLA91958533693_092025-F.webp',
            '../imagemscooterpreta/D_NQ_NP_2X_767964-MLA91958573481_092025-F.webp',
            '../imagemscooterpreta/D_NQ_NP_2X_835789-MLA91559669066_092025-F.webp',
            '../imagemscooterpreta/D_NQ_NP_2X_877882-MLA91958603329_092025-F.webp',
            '../imagemscooterpreta/D_NQ_NP_2X_883810-MLA91958623277_092025-F.webp',
            '../imagemscooterpreta/D_NQ_NP_2X_940012-MLA91958533713_092025-F.webp'
          ]},
          amarela: { label: 'Amarela', vendas: '7.653', images: [
            '../imagemscooteramarela/D_NQ_NP_2X_667141-MLA96643803407_102025-F.webp',
            '../imagemscooteramarela/D_NQ_NP_2X_720389-MLA96197773920_102025-F.webp',
            '../imagemscooteramarela/D_NQ_NP_2X_768586-MLA96197882302_102025-F.webp',
            '../imagemscooteramarela/D_NQ_NP_2X_923365-MLA92387512050_092025-F.webp',
            '../imagemscooteramarela/D_NQ_NP_2X_925917-MLA92795982981_092025-F.webp',
            '../imagemscooteramarela/D_NQ_NP_2X_970312-MLA92387512086_092025-F.webp'
          ]},
          azul: { label: 'Azul', vendas: '9.432', images: [
            '../imagemscooterazul/D_NQ_NP_2X_634494-MLA96644090069_102025-F.webp',
            '../imagemscooterazul/D_NQ_NP_2X_654683-MLA96197724042_102025-F.webp',
            '../imagemscooterazul/D_NQ_NP_2X_702950-MLA96644474813_102025-F.webp',
            '../imagemscooterazul/D_NQ_NP_2X_779585-MLA96644464863_102025-F.webp',
            '../imagemscooterazul/D_NQ_NP_2X_819716-MLA96198038836_102025-F.webp',
            '../imagemscooterazul/D_NQ_NP_2X_876450-MLA96197940808_102025-F.webp',
            '../imagemscooterazul/D_NQ_NP_2X_921899-MLA96881158875_102025-F.webp'
          ]},
          branca: { label: 'Branca', vendas: '8.129', images: [
            '../imagemscooterbranca/D_NQ_NP_2X_679453-MLA92387568816_092025-F.webp',
            '../imagemscooterbranca/D_NQ_NP_2X_686007-MLA92795922267_092025-F.webp',
            '../imagemscooterbranca/D_NQ_NP_2X_690911-MLA99543742020_122025-F.webp',
            '../imagemscooterbranca/D_NQ_NP_2X_759010-MLA92387618372_092025-F.webp',
            '../imagemscooterbranca/D_NQ_NP_2X_828166-MLA92387510116_092025-F.webp',
            '../imagemscooterbranca/D_NQ_NP_2X_963739-MLA92387608408_092025-F.webp'
          ]},
          bronze: { label: 'Bronze', vendas: '6.210', images: [
            '../imagemscooterbronze/D_NQ_NP_2X_698492-MLA85005107668_052025-F.webp',
            '../imagemscooterbronze/D_NQ_NP_2X_744419-MLA85005032136_052025-F.webp',
            '../imagemscooterbronze/D_NQ_NP_2X_834378-MLA85005145252_052025-F.webp',
            '../imagemscooterbronze/D_NQ_NP_2X_834810-MLA85305884479_052025-F.webp',
            '../imagemscooterbronze/D_NQ_NP_2X_844157-MLA85005032064_052025-F.webp',
            '../imagemscooterbronze/D_NQ_NP_2X_848949-MLA85005145240_052025-F.webp'
          ]},
          cinzaescuro: { label: 'Cinza Escuro', vendas: '5.400', images: [
            '../imagemscootercinzaescuro/D_NQ_NP_2X_680508-MLA91957844005_092025-F.webp',
            '../imagemscootercinzaescuro/D_NQ_NP_2X_715619-MLA99963838091_112025-F.webp',
            '../imagemscootercinzaescuro/D_NQ_NP_2X_755109-MLA91957814599_092025-F.webp',
            '../imagemscootercinzaescuro/D_NQ_NP_2X_770229-MLA91558780716_092025-F.webp',
            '../imagemscootercinzaescuro/D_NQ_NP_2X_859195-MLA91957764571_092025-F.webp',
            '../imagemscootercinzaescuro/D_NQ_NP_2X_879514-MLA91957814563_092025-F.webp',
            '../imagemscootercinzaescuro/D_NQ_NP_2X_974161-MLA91957844107_092025-F.webp'
          ]},
          laranja: { label: 'Laranja', vendas: '4.900', images: [
            '../imagemscooterlaranja/D_NQ_NP_2X_642118-MLA106965349202_022026-F.webp',
            '../imagemscooterlaranja/D_NQ_NP_2X_817034-MLA99992146087_112025-F.webp',
            '../imagemscooterlaranja/D_NQ_NP_2X_838700-MLA107649356847_022026-F.webp',
            '../imagemscooterlaranja/D_NQ_NP_2X_893000-MLA106965139406_022026-F.webp',
            '../imagemscooterlaranja/D_NQ_NP_2X_952938-MLA106965378952_022026-F.webp',
            '../imagemscooterlaranja/D_NQ_NP_2X_978254-MLA107641463359_022026-F.webp',
            '../imagemscooterlaranja/D_NQ_NP_2X_985063-MLA107642210743_022026-F.webp'
          ]},
          prateada: { label: 'Prateada', vendas: '4.300', images: [
            '../imagemscooterprateado/D_NQ_NP_2X_651415-MLA108027382657_032026-F.webp',
            '../imagemscooterprateado/D_NQ_NP_2X_692120-MLA107320128988_032026-F.webp',
            '../imagemscooterprateado/D_NQ_NP_2X_709553-MLA108028393133_032026-F.webp',
            '../imagemscooterprateado/D_NQ_NP_2X_780846-MLA108027681681_032026-F.webp',
            '../imagemscooterprateado/D_NQ_NP_2X_870206-MLA107320455426_032026-F.webp',
            '../imagemscooterprateado/D_NQ_NP_2X_990176-MLA108027712199_032026-F.webp'
          ]},
          rosa: { label: 'Rosa', vendas: '11.204', images: [
            '../imagemscooterrosa/D_NQ_NP_2X_638739-MLA99709210702_122025-F.webp',
            '../imagemscooterrosa/D_NQ_NP_2X_695488-MLA100194993407_122025-F.webp',
            '../imagemscooterrosa/D_NQ_NP_2X_701380-MLA100195284845_122025-F.webp',
            '../imagemscooterrosa/D_NQ_NP_2X_811669-MLA100195003191_122025-F.webp',
            '../imagemscooterrosa/D_NQ_NP_2X_835292-MLA99709260086_122025-F.webp',
            '../imagemscooterrosa/D_NQ_NP_2X_875178-MLA99709181454_122025-F.webp'
          ]},
          verde: { label: 'Verde', vendas: '8.900', images: [
            '../imagemscooterverde/D_NQ_NP_2X_623929-MLA96644162415_102025-F.webp',
            '../imagemscooterverde/D_NQ_NP_2X_659048-MLA96644517287_102025-F.webp',
            '../imagemscooterverde/D_NQ_NP_2X_705027-MLA96644527305_102025-F.webp',
            '../imagemscooterverde/D_NQ_NP_2X_751360-MLA96644467863_102025-F.webp',
            '../imagemscooterverde/D_NQ_NP_2X_807740-MLA96198347360_102025-F.webp',
            '../imagemscooterverde/D_NQ_NP_2X_823059-MLA96197943722_102025-F.webp',
            '../imagemscooterverde/D_NQ_NP_2X_918345-MLA96644576973_102025-F.webp'
          ]},
          verdelimao: { label: 'Verde Limão', vendas: '7.100', images: [
            '../imagemscooterverdelimao/D_NQ_NP_2X_621622-MLA91559935918_092025-F.webp',
            '../imagemscooterverdelimao/D_NQ_NP_2X_632466-MLA91559662092_092025-F.webp',
            '../imagemscooterverdelimao/D_NQ_NP_2X_747812-MLA91559935912_092025-F.webp',
            '../imagemscooterverdelimao/D_NQ_NP_2X_825123-MLA91559671772_092025-F.webp',
            '../imagemscooterverdelimao/D_NQ_NP_2X_844521-MLA91559886224_092025-F.webp',
            '../imagemscooterverdelimao/D_NQ_NP_2X_893869-MLA91559671740_092025-F.webp',
            '../imagemscooterverdelimao/D_NQ_NP_2X_978206-MLA91559671754_092025-F.webp'
          ]},
          vermelha: { label: 'Vermelha', vendas: '9.600', images: [
            '../imagemscootervermelho/D_NQ_NP_2X_606638-MLA91971019049_092025-F.webp',
            '../imagemscootervermelho/D_NQ_NP_2X_627005-MLA91971168029_092025-F.webp',
            '../imagemscootervermelho/D_NQ_NP_2X_692693-MLA91571654290_092025-F.webp',
            '../imagemscootervermelho/D_NQ_NP_2X_734982-MLA91971078873_092025-F.webp',
            '../imagemscootervermelho/D_NQ_NP_2X_805961-MLA91971078829_092025-F.webp',
            '../imagemscootervermelho/D_NQ_NP_2X_840409-MLA108661535452_032026-F.webp',
            '../imagemscootervermelho/D_NQ_NP_2X_933559-MLA91970979409_092025-F.webp',
            '../imagemscootervermelho/D_NQ_NP_2X_982468-MLA99991189235_112025-F.webp'
          ]}
        },
        gb: { 'unica': { extra: 0, extraOrig: 0 } }
      }
    };

    let currentModel = 'scooter';
    let currentColor = 'preta';
    let currentGB = 'unica';
    let currentQty = 1;
    let currentFlux = 'cart';
    let userInteracted = false;
    let inicializacaoConcluida = false;

    // PRODUTO_ATUAL para exportação do carrinho
    const PRODUTO_ATUAL = {
      id: 102,
      nome: 'Scooter Elétrica TUI 1000w',
      preco: 129.90,
      img: ''
    };`;

if (html.includes(modelsStart)) {
  const startIdx = html.indexOf(modelsStart);
  const endIdx = html.indexOf(modelsEnd) + modelsEnd.length;
  html = html.substring(0, startIdx) + newModels + html.substring(endIdx);
  console.log('IPHONE_MODELS substituído com sucesso!');
} else {
  console.log('AVISO: modelsStart não encontrado!');
  // Tenta sem \r\n
  const modelsStartLF = modelsStart.replace(/\r\n/g, '\n');
  const modelsEndLF = modelsEnd.replace(/\r\n/g, '\n');
  if (html.includes(modelsStartLF)) {
    const startIdx = html.indexOf(modelsStartLF);
    const endIdx = html.indexOf(modelsEndLF) + modelsEndLF.length;
    html = html.substring(0, startIdx) + newModels + html.substring(endIdx);
    console.log('IPHONE_MODELS substituído (LF) com sucesso!');
  } else {
    console.log('FALHA: bloco JS não encontrado para substituição');
  }
}

// Descrição do produto
const oldDesc = '<strong>Apple iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max (Vitrine Premium)</strong>';
const newDesc = `<strong>O que você precisa saber sobre este produto:</strong><br>
            • Potência do motor de 1 kW para aceleração rápida.<br>
            • Autonomia de até 60 km para longas distâncias.<br>
            • Bateria de lítio 60V com capacidade de 10.4 Ah.<br>
            • Tempo de carregamento de 4 a 6 horas.<br>
            • Freios a disco hidráulico para maior segurança.<br>
            • Peso máximo suportado de até 190 kg.<br><br>
            <strong>TUI - Equipamento de Mobilidade Autopropelido | 1000W | Bateria de Lítio</strong><br>
            Descubra a liberdade de se locomover com a TUI! Motor de 1000W, bateria de lítio 60V, autonomia de até 60km, 12 cores disponíveis.<br><br>
            <strong>Principais Benefícios:</strong><br>
            • Motor potente de 1000W — aceleração rápida e desempenho superior.<br>
            • Bateria de Lítio de Alta Performance — vida útil prolongada.<br>
            • Energia Ecológica — não emite poluentes.<br>
            • Pneus largos e resistentes — estabilidade em diferentes terrenos.<br>
            • Freios a disco eficientes — maior segurança de frenagem.<br>
            • Carregador Inteligente — desliga automaticamente ao completar a carga.<br><br>
            <strong>Especificações Técnicas:</strong><br>
            • Potência: 1000W | Velocidade Máxima: 30 km/h<br>
            • Autonomia: até 60 km | Peso Suportado: até 190 kg<br>
            • Bateria: Lítio 60V | Recarga: 4 a 6 horas<br>
            • Freios: A disco | Bivolt (110V/220V)<br><br>
            <strong>Conteúdo da Embalagem:</strong> 1 TUI + 1 Carregador Inteligente<br><br>
            <strong>Aviso legal:</strong> Não precisa de emplacamento (Resolução Contran 996/2023). Idade mínima recomendada: 10 anos.`;
html = html.split(oldDesc).join(newDesc);

fs.writeFileSync(file, html, 'utf8');
console.log('Arquivo salvo com sucesso!');
