// ===== Compatibilidade de PIX assíncrono (Netlify) =====
// Na Netlify, /api/create-pix responde { pending: true, ref } na hora, porque
// a SpeedPag demora ~33s e functions normais têm limite de 10s.
// Este script intercepta o fetch e, quando recebe "pending", consulta
// /api/pix-result/:ref até o PIX ficar pronto, devolvendo a resposta final
// no mesmo formato de antes. Assim nenhuma página precisa mudar.
// Rodando localmente (node server.js) a resposta já vem pronta e passa direto.
(function () {
  if (window.__pixNetlifyPatched) return;
  window.__pixNetlifyPatched = true;

  var originalFetch = window.fetch.bind(window);
  var INTERVALO_MS = 2000;
  var TIMEOUT_MS = 120000;

  function ehRotaCriarPix(input) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    return /\/api\/create-pix(-pneu)?(\?|$)/.test(url);
  }

  function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function aguardarResultado(ref) {
    var inicio = Date.now();
    while (Date.now() - inicio < TIMEOUT_MS) {
      await esperar(INTERVALO_MS);
      try {
        var r = await originalFetch('/api/pix-result/' + encodeURIComponent(ref), { cache: 'no-store' });
        if (!r.ok && r.status !== 404) continue;
        var j = await r.json();
        if (j && j.done) {
          return new Response(JSON.stringify(j.data || {}), {
            status: j.httpStatus || 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (e) { /* tenta de novo */ }
    }
    return new Response(JSON.stringify({ error: 'Tempo esgotado ao gerar PIX' }), {
      status: 504,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  window.fetch = async function (input, init) {
    var resp = await originalFetch(input, init);
    if (!ehRotaCriarPix(input)) return resp;
    try {
      var j = await resp.clone().json();
      if (j && j.pending && j.ref) return aguardarResultado(j.ref);
    } catch (e) { /* não é JSON, devolve como veio */ }
    return resp;
  };
})();
