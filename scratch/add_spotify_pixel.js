const fs = require('fs');
const path = require('path');

const spotifyPixel = `<!-- Spotify Pixel Code Start -->
<script>
  (function(w, d){
    var id='spdt-capture', n='script';
    if (!d.getElementById(id)) {
      w.spdt = w.spdt || function() { (w.spdt.q = w.spdt.q || []).push(arguments); };
      var e = d.createElement(n); e.id = id; e.async=1;
      e.src = 'https://pixel.byspotify.com/ping.min.js';
      var s = d.getElementsByTagName(n)[0]; s.parentNode.insertBefore(e, s);
    }
    w.spdt('conf', { key: 'b2d850e2d437439d8f7ed7f0a10968f0' });
    w.spdt('view');
  })(window, document);
</script>
<!-- Spotify Pixel Code End -->`;

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already contains Spotify Pixel key
  if (content.includes('b2d850e2d437439d8f7ed7f0a10968f0')) {
    console.log(`[Spotify Pixel] Already installed in ${path.basename(filePath)}`);
    return;
  }

  // Insert after TikTok Pixel Code End if it exists, otherwise after <head>
  const tiktokEndTag = '<!-- TikTok Pixel Code End -->';
  if (content.includes(tiktokEndTag)) {
    content = content.replace(tiktokEndTag, `${tiktokEndTag}\n${spotifyPixel}`);
    console.log(`[Spotify Pixel] Installed after TikTok pixel end tag in ${path.basename(filePath)}`);
  } else if (content.includes('<head>')) {
    content = content.replace('<head>', `<head>\n${spotifyPixel}`);
    console.log(`[Spotify Pixel] Installed after <head> in ${path.basename(filePath)}`);
  } else {
    console.warn(`[Spotify Pixel] Could not find <head> or TikTok end tag in ${path.basename(filePath)}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Process root index.html
const rootIndex = path.join(__dirname, '..', 'index.html');
if (fs.existsSync(rootIndex)) {
  processHtmlFile(rootIndex);
}

// 2. Process all html files in pages/
const pagesDir = path.join(__dirname, '..', 'pages');
if (fs.existsSync(pagesDir)) {
  const files = fs.readdirSync(pagesDir);
  files.forEach(file => {
    if (file.endsWith('.html')) {
      processHtmlFile(path.join(pagesDir, file));
    }
  });
}

console.log('Finished injecting Spotify Base Pixel.');
