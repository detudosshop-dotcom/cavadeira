const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(/"Seu Pedido"/g, '"ТіκToκ Ѕhορ"');
fs.writeFileSync('server.js', c);
console.log('Replaced');
