const fs = require('fs');
let file = 'js/avaliacoes-scooter.js';
let content = fs.readFileSync(file, 'utf8');

let currentDate = new Date(2026, 7, 5); // 5 de Agosto de 2026

content = content.replace(/"date":\s*"[^"]+"/g, () => {
    let d = currentDate.toISOString().split('T')[0];
    let h = String(Math.floor(Math.random()*15)+8).padStart(2,'0');
    let m = String(Math.floor(Math.random()*60)).padStart(2,'0');
    let result = `"date": "${d} ${h}:${m}"`;
    
    // Subtrai de 0 a 1 dia para a proxima iteracao
    currentDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 2));
    
    return result;
});

fs.writeFileSync(file, content, 'utf8');
console.log('Datas atualizadas com sucesso!');
