// ===== Netlify Background Function: gera o PIX na SpeedPag =====
// O sufixo "-background" faz a Netlify responder 202 na hora e deixar
// esta funÃ§Ã£o rodar por atÃ© 15 minutos (a SpeedPag leva ~33s).
// O resultado Ã© salvo no Netlify Blobs e lido por /api/pix-result/:ref.
const { connectLambda, getStore } = require('@netlify/blobs');
const server = require('../../server.js');

exports.handler = async (event) => {
  if (event && event.blobs) connectLambda(event);
  const store = getStore({ name: 'pix-pedidos', consistency: 'strong' });

  let payload = {};
  try { payload = JSON.parse(event.body || '{}'); } catch (e) { }
  const { ref, tag = 'principal', host = '', ip = '127.0.0.1', body = {} } = payload;
  if (!ref) return;

  try {
    const result = await server.criarPixCore(body, { tag, host, ip });
    await store.setJSON(ref, { status: 'done', httpStatus: result.status, data: result.data, finishedAt: Date.now() });
  } catch (err) {
    console.error('[create-pix-background]', err.message);
    await store.setJSON(ref, { status: 'done', httpStatus: 500, data: { error: 'Erro ao gerar PIX', details: err.message } });
  }

  // Garante que e-mail e Utmify terminem antes da funÃ§Ã£o encerrar
  await server.aguardarTarefasPendentes();
};
