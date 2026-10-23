const fs = require('fs');
const path = require('path');

const coresDir = [
  'imagemscooterpreta', 'imagemscooteramarela', 'imagemscooterazul',
  'imagemscooterbranca', 'imagemscooterbronze', 'imagemscootercinzaescuro',
  'imagemscooterlaranja', 'imagemscooterprateado', 'imagemscooterrosa',
  'imagemscooterverde', 'imagemscooterverdelimao', 'imagemscootervermelho'
];

const nomesCores = {
  'imagemscooterpreta': 'Preta',
  'imagemscooteramarela': 'Amarela',
  'imagemscooterazul': 'Azul',
  'imagemscooterbranca': 'Branca',
  'imagemscooterbronze': 'Bronze',
  'imagemscootercinzaescuro': 'Cinza Escuro',
  'imagemscooterlaranja': 'Laranja',
  'imagemscooterprateado': 'Prateada',
  'imagemscooterrosa': 'Rosa',
  'imagemscooterverde': 'Verde',
  'imagemscooterverdelimao': 'Verde Limão',
  'imagemscootervermelho': 'Vermelha'
};

const objModel = {
  'scooter': {
    name: 'Scooter Elétrica TUI 1000w',
    basePrice: 129.90,
    basePriceOrig: 2344.00,
    cores: {},
    gb: {
      'unica': { extra: 0, extraOrig: 0 } // dummy
    }
  }
};

for (const dirName of coresDir) {
  const dirPath = path.join(__dirname, '..', dirName);
  const colorKey = dirName.replace('imagemscooter', '');
  
  let files = [];
  try {
    files = fs.readdirSync(dirPath).filter(f => f.match(/\.(png|jpe?g|webp)$/i));
  } catch(e) {}
  
  const relPaths = files.map(f => `../${dirName}/${f}`);
  
  objModel['scooter'].cores[colorKey] = {
    label: nomesCores[dirName],
    vendas: (Math.floor(Math.random() * 50) + 10) + '.' + (Math.floor(Math.random() * 899) + 100),
    images: relPaths
  };
}

console.log(JSON.stringify(objModel, null, 2));
