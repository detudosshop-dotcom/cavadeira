// ===== Netlify Function: API principal (Express do server.js) =====
// Todas as rotas /api/* chegam aqui via redirect do netlify.toml.
//
// A SpeedPag leva ~33s para gerar o PIX, mas functions normais da Netlify
// morrem em 10s. Por isso /api/create-pix aqui apenas ENFILEIRA o pedido
// numa Background Function (atÃ© 15 min) e devolve { pending, ref }.
// O front (js/pix-netlify.js) consulta /api/pix-result/:ref atÃ© ficar pronto.
const crypto = require('crypto');
const express = require('express');
const serverless = require('serverless-http');
const { connectLambda, getStore } = require('@netlify/blobs');
const app = require('../../server.js');

const STORE = 'pix-pedidos';
const store = () => getStore({ name: STORE, consistency: 'strong' });

const wrapper = express();

// Normaliza o caminho: /.netlify/functions/api/xyz -> /api/xyz
wrapper.use((req, res, next) => {
  req.url = req.url.replace(/^\/\.netlify\/functions\/api(\/|$)/, '/api/');
  next();
});
wrapper.use(express.json());

// Inicia a geraÃ§Ã£o do PIX em segundo plano
wrapper.post(['/api/create-pix', '/api/create-pix-pneu'], async (req, res) => {
  try {
    const ref = crypto.randomUUID();
    const tag = req.path.endsWith('-pneu') ? 'pneu' : 'principal';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const ip = String(req.headers['x-nf-client-connection-ip'] || req.headers['x-forwarded-for'] || '127.0.0.1').split(',')[0].trim();

    await store().setJSON(ref, { status: 'processing', createdAt: Date.now() });

    const r = await fetch(`https://${host}/.netlify/functions/create-pix-background`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref, tag, host, ip, body: req.body || {} })
    });
    if (r.status !== 202 && !r.ok) {
      console.error('[api] Falha ao acionar background function:', r.status);
      return res.status(502).json({ error: 'Falha ao iniciar geraÃ§Ã£o do PIX' });
    }

    return res.status(202).json({ pending: true, ref });
  } catch (err) {
    console.error('[api] create-pix erro:', err.message);
    return res.status(500).json({ error: 'Erro ao iniciar PIX', details: err.message });
  }
});

// Consulta o resultado da geraÃ§Ã£o
wrapper.get('/api/pix-result/:ref', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const item = await store().get(req.params.ref, { type: 'json' });
    if (!item) return res.status(404).json({ error: 'Pedido nÃ£o encontrado' });
    if (item.status !== 'done') return res.status(200).json({ pending: true });
    return res.status(200).json({ done: true, httpStatus: item.httpStatus, data: item.data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Demais rotas: Express original
wrapper.use(app);

const handler = serverless(wrapper);

exports.handler = async (event, context) => {
  if (event && event.blobs) connectLambda(event);
  return handler(event, context);
};
