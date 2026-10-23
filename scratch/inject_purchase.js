const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pages', 'checkout.html');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF for easier replacement, then we'll save it
content = content.replace(/\r\n/g, '\n');

// 1. Inject Spotify Base Pixel after TikTok Pixel Code End if not already there
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

if (!content.includes('b2d850e2d437439d8f7ed7f0a10968f0')) {
  content = content.replace('<!-- TikTok Pixel Code End -->', `<!-- TikTok Pixel Code End -->\n${spotifyPixel}`);
}

// 2. Inject window.dispararSpotifyPurchase function definition
const spotifyFunctionDef = `    window.dispararSpotifyPurchase = function(valor) {
      try {
        if (window.spdt) {
          window.spdt('purchase', {
            value: parseFloat(valor) || 0,
            currency: 'BRL'
          });
          console.log('[Spotify Pixel] Purchase disparado no checkout. Valor:', valor);
        } else {
          console.warn('[Spotify Pixel] spdt não inicializado ainda.');
        }
      } catch(e) {
        console.error('[Spotify Pixel] Erro ao disparar Purchase:', e);
      }
    };`;

if (!content.includes('dispararSpotifyPurchase')) {
  // We locate the closing tag of the TikTok definition script
  const tiktokFunctionEnd = `    };
  </script>`;
  
  if (content.includes(tiktokFunctionEnd)) {
    content = content.replace(tiktokFunctionEnd, `    };\n\n${spotifyFunctionDef}\n  </script>`);
  } else {
    console.warn('Could not find TikTok function end pattern to inject Spotify function');
  }
}

// 3. Inject Spotify Purchase call after TikTok Purchase call
if (content.includes('window.dispararTikTokPurchase(valorReais);') && !content.includes('window.dispararSpotifyPurchase(valorReais);')) {
  content = content.replace(
    'window.dispararTikTokPurchase(valorReais);',
    'window.dispararTikTokPurchase(valorReais);\n          window.dispararSpotifyPurchase(valorReais);'
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected Spotify Pixel & Purchase tracking into checkout.html');
