const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(/"ТіκToκ Ѕhορ"/g, '"Seu Pedido"');
fs.writeFileSync('server.js', c);

const files = ['pages/pix.html', 'pages/checkout.html'];
for (const f of files) {
  let d = fs.readFileSync(f, 'utf8');
  d = d.replace(/\.replace\(\/\\bLt\\b\/gi, "LTDA"\)/g, '.replace(/\\bLt\\b/gi, "LTDA").replace(/\\bLtd\\b/gi, "LTDA")');
  fs.writeFileSync(f, d);
}
console.log('Done');
