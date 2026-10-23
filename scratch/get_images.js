const fs = require('fs');
const file = 'c:/Users/eduar/.gemini/antigravity-ide/brain/b100e975-92cc-4732-9d78-466eaf7e1df5/scratch/pirelli_html.html';
if (fs.existsSync(file)) {
  const html = fs.readFileSync(file, 'utf8');
  const matches = html.match(/https?:\/\/[^\"]+\.(png|jpg|jpeg|webp)/g);
  if (matches) {
    const unique = [...new Set(matches)];
    const scorpionMatches = unique.filter(m => m.toLowerCase().includes('scorpion') || m.toLowerCase().includes('verde') || m.toLowerCase().includes('atr') || m.toLowerCase().includes('sc'));
    console.log('Scorpion-related images found:', scorpionMatches.length);
    console.log(scorpionMatches);
  }
} else {
  console.log('File does not exist');
}
