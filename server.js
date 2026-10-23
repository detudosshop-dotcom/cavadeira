// ===== FAMOSINHOS SHOP - Backend Express (Vercel + SpeedPag + Utmify) =====
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// -----------------------------------------------------------------------
// Carrega variáveis do arquivo .env (apenas para rodar localmente).
// Na Netlify as variáveis são configuradas no painel do site.
// -----------------------------------------------------------------------
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    });
  }
} catch (e) { /* ignora */ }

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------
// CONFIGURAÇÕES — SpeedPag (Gateway Principal da Loja)
// -----------------------------------------------------------------------
const SPEEDPAG_PUBLIC_KEY = process.env.SPEEDPAG_PUBLIC_KEY || '';
const SPEEDPAG_SECRET_KEY = process.env.SPEEDPAG_SECRET_KEY || '';
const SPEEDPAG_BASE = 'https://api.speedpag.com.br/v1';

// -----------------------------------------------------------------------
// CONFIGURAÇÕES — Utmify (Rastreamento de Vendas & Webhooks)
// -----------------------------------------------------------------------
const UTMIFY_TOKEN = process.env.UTMIFY_TOKEN || '';
const UTMIFY_ENDPOINT = 'https://api.utmify.com.br/api-credentials/orders';
const _pedidosPagosUtmify = new Set();

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

// -----------------------------------------------------------------------
// HELPER: fetch nativo Node 18+ ou fallback para node-fetch
// -----------------------------------------------------------------------
let fetchFn;
if (typeof fetch !== 'undefined') {
  fetchFn = fetch;
} else {
  fetchFn = (...args) => import('node-fetch').then(m => m.default(...args));
}

function getSpeedPagAuth() {
  return 'Basic ' + Buffer.from(SPEEDPAG_PUBLIC_KEY + ':' + SPEEDPAG_SECRET_KEY).toString('base64');
}

// -----------------------------------------------------------------------
// FUNÇÃO CENTRAL: Notificar Utmify (PIX Pendente e PIX Pago)
// -----------------------------------------------------------------------
async function _enviarUtmify({
  orderId,
  status, // 'waiting_payment' ou 'paid'
  amountInCents,
  customer = {},
  products = [],
  trackingParameters = {},
  createdAt = null,
  approvedDate = null
}) {
  try {
    if (!UTMIFY_TOKEN) return;

    if (status === 'paid') {
      if (_pedidosPagosUtmify.has(String(orderId))) {
        console.log(`[Utmify] Pedido ${orderId} já notificado como pago. Ignorando duplicata.`);
        return;
      }
      _pedidosPagosUtmify.add(String(orderId));
    }

    const dataHoraIso = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const payload = {
      orderId: String(orderId),
      platform: 'SpeedPag',
      paymentMethod: 'pix',
      status: status,
      createdAt: createdAt || dataHoraIso,
      approvedDate: status === 'paid' ? (approvedDate || dataHoraIso) : null,
      refundedAt: null,
      customer: {
        name: customer.name || 'Cliente',
        email: customer.email || '',
        phone: (customer.phone || '').replace(/\D/g, '') || null,
        document: (customer.document || customer.taxId || '').replace(/\D/g, '') || null,
        country: 'BR',
        ip: customer.ip || '127.0.0.1'
      },
      products: Array.isArray(products) && products.length > 0
        ? products.map((p, idx) => ({
            id: String(p.id || idx + 1),
            name: String(p.nome || p.name || p.title || 'Produto'),
            planId: null,
            planName: null,
            quantity: Number(p.quantity || p.qty || 1),
            priceInCents: Number(p.priceInCents || Math.round(Number(p.preco || 0) * 100) || amountInCents)
          }))
        : [{
            id: '1',
            name: 'Produto Loja',
            planId: null,
            planName: null,
            quantity: 1,
            priceInCents: amountInCents
          }],
      trackingParameters: {
        utm_source: trackingParameters.utm_source || null,
        utm_campaign: trackingParameters.utm_campaign || null,
        utm_medium: trackingParameters.utm_medium || null,
        utm_content: trackingParameters.utm_content || null,
        utm_term: trackingParameters.utm_term || null
      },
      commission: {
        totalPriceInCents: amountInCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: amountInCents,
        currency: 'BRL'
      },
      isTest: false
    };

    console.log(`[Utmify] Enviando pedido ${orderId} com status [${status}]...`);

    const r = await fetchFn(UTMIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-api-token': UTMIFY_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resText = await r.text();
    console.log(`[Utmify] Resposta (${r.status}):`, resText.slice(0, 200));
  } catch (err) {
    console.error('[Utmify] Erro ao enviar notificação:', err.message);
  }
}

app.get('/api/my-ip', async (req, res) => {
  try {
    const r = await fetchFn('https://api.ipify.org?format=json');
    const data = await r.json();
    return res.json({ ip_saida_vercel: data.ip });
  } catch (e) {
    return res.json({ erro: e.message });
  }
});

app.post('/api/visita', async (req, res) => {
  try {
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[/api/visita]', err.message);
    return res.status(500).json({ error: 'Erro ao registrar visita' });
  }
});

// -----------------------------------------------------------------------
// FUNÇÃO CENTRAL: Criação de PIX na SpeedPag
// -----------------------------------------------------------------------
// Tarefas em segundo plano (e-mail, Utmify) — permite que serverless aguarde antes de encerrar
const _tarefasPendentes = new Set();
function _rastrearTarefa(p) {
  _tarefasPendentes.add(p);
  p.finally(() => _tarefasPendentes.delete(p));
  return p;
}
async function aguardarTarefasPendentes() {
  await Promise.allSettled([..._tarefasPendentes]);
}

async function _criarPixSpeedPag(req, res, tag = 'padrao') {
  const result = await criarPixCore(req.body || {}, {
    tag,
    host: req.headers.host,
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'
  });
  return res.status(result.status).json(result.data);
}

// Núcleo reutilizável (Express local e background function da Netlify)
// Retorna { status, data }
async function criarPixCore(body, { tag = 'padrao', host = '', ip = '127.0.0.1' } = {}) {
  const res = {
    _status: 200,
    status(code) { this._status = code; return this; },
    json(data) { return { status: this._status, data }; }
  };
  const req = { headers: { host, 'x-forwarded-for': ip }, socket: {} };
  try {
    const {
      amount, name = '', email = '', cellphone = '', taxId = '',
      utm_source = '', utm_medium = '', utm_campaign = '', utm_term = '', utm_content = '',
      src = '', fbp = '', fbc = '', user_agent = '',
      items = [], address = {}, frete = 0, subtotal = 0, is_upsell = false
    } = body || {};

    if (!amount || amount <= 0) return res.status(400).json({ error: 'Valor inválido' });
    if (!name || !taxId) return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });

    const amountInCents = Math.round(Number(amount));
    const cleanTaxId = String(taxId).replace(/\D/g, '');
    const cleanPhone = String(cellphone || (address && address.tel) || '').replace(/\D/g, '');

    // Formata lista de itens para o padrão da SpeedPag
    let speedpagItems = [];
    if (Array.isArray(items) && items.length > 0) {
      speedpagItems = items.map((it, idx) => {
        const itemUnitPrice = Math.round(Number(it.preco || it.price || 0) * 100);
        return {
          title: String(it.nome || it.name || it.title || `Item ${idx + 1}`).slice(0, 100),
          quantity: Number(it.qty || it.quantity || 1),
          unitPrice: itemUnitPrice > 0 ? itemUnitPrice : amountInCents,
          tangible: false,
          externalRef: ''
        };
      });
    } else {
      speedpagItems = [{
        title: 'Produto Loja',
        quantity: 1,
        unitPrice: amountInCents,
        tangible: false,
        externalRef: ''
      }];
    }

    const payload = {
      amount: amountInCents,
      paymentMethod: 'pix',
      customer: {
        name: name.slice(0, 100),
        email: (email || 'cliente@loja.com').trim(),
        phone: cleanPhone.length >= 10 ? cleanPhone : '11999999999',
        document: {
          type: cleanTaxId.length > 11 ? 'cnpj' : 'cpf',
          number: cleanTaxId || '42232599813'
        }
      },
      items: speedpagItems,
      postbackUrl: `https://${req.headers.host || 'lojafamosinhosshop.vercel.app'}/api/pix-webhook`,
      metadata: JSON.stringify({ utm_source, utm_medium, utm_campaign, utm_term, utm_content, src, tag })
    };

    console.log(`[/api/create-pix] SpeedPag [${tag}] — Gerando PIX para:`, name, '| valor (centavos):', amountInCents);

    const resp = await fetchFn(`${SPEEDPAG_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': getSpeedPagAuth(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const rawText = await resp.text();
    console.log(`[/api/create-pix] SpeedPag [${tag}] resposta (raw):`, rawText.slice(0, 300));

    let data = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseErr) {
      console.error('[/api/create-pix] Erro ao parsear JSON:', parseErr.message);
      return res.status(502).json({ error: 'Resposta inválida da SpeedPag', raw: rawText.slice(0, 200) });
    }

    if (!resp.ok) {
      console.error('[/api/create-pix] Erro retornado pela SpeedPag:', data);
      return res.status(resp.status).json({
        error: data.message || 'Erro ao gerar PIX na SpeedPag',
        details: data
      });
    }

    const pixQrcode = (data.pix && data.pix.qrcode) ? data.pix.qrcode : '';
    const transactionId = data.id || ('spd_' + Date.now());

    // Normalização completa esperada pelo frontend
    const normalized = {
      ...data,
      pix_code: pixQrcode,
      qr_code: pixQrcode,
      txid: transactionId,
      transaction_id: transactionId,
      status: data.status || 'waiting_payment'
    };

    if (resp.ok && normalized.pix_code && email && SMTP_USER && SMTP_PASS && !is_upsell) {
      _rastrearTarefa(_dispararEmailPix({
        email, name, pixCode: normalized.pix_code, txid: normalized.txid,
        items, address, frete, subtotal, amount, cellphone
      }).catch(err => console.error('[email] Falha silenciosa:', err.message)));
    } else if (is_upsell) {
      console.log('[/api/create-pix] Upsell detectado. E-mail suprimido.');
    }

    // Notifica a Utmify sobre o PIX gerado (waiting_payment)
    if (resp.ok && normalized.txid) {
      _rastrearTarefa(_enviarUtmify({
        orderId: normalized.txid,
        status: 'waiting_payment',
        amountInCents: amountInCents,
        customer: {
          name: name,
          email: email,
          phone: cleanPhone,
          document: cleanTaxId,
          ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'
        },
        products: speedpagItems,
        trackingParameters: { utm_source, utm_medium, utm_campaign, utm_term, utm_content }
      }).catch(e => console.error('[Utmify] Falha silenciosa:', e.message)));
    }

    return res.status(200).json(normalized);
  } catch (err) {
    console.error('[/api/create-pix]', err.message);
    return res.status(500).json({ error: 'Erro ao gerar PIX via SpeedPag', details: err.message });
  }
}

// -----------------------------------------------------------------------
// ROTA: Gerar PIX via SpeedPag (rota principal da loja)
// POST /api/create-pix
// -----------------------------------------------------------------------
app.post('/api/create-pix', async (req, res) => {
  return _criarPixSpeedPag(req, res, 'principal');
});

// -----------------------------------------------------------------------
// ROTA: Gerar PIX para o produto PNEU (também via SpeedPag)
// POST /api/create-pix-pneu
// -----------------------------------------------------------------------
app.post('/api/create-pix-pneu', async (req, res) => {
  return _criarPixSpeedPag(req, res, 'pneu');
});

// -----------------------------------------------------------------------
// ROTA: Consultar Status do Pagamento (SpeedPag + Notificação Utmify)
// GET /api/payment-status/:txid
// -----------------------------------------------------------------------
app.get('/api/payment-status/:txid', async (req, res) => {
  try {
    const { txid } = req.params;
    if (!txid) return res.status(400).json({ error: 'txid obrigatório' });
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');

    const resp = await fetchFn(`${SPEEDPAG_BASE}/transactions/${txid}`, {
      headers: {
        'Authorization': getSpeedPagAuth(),
        'Accept': 'application/json'
      }
    });

    const rawText = await resp.text();
    console.log('[/api/payment-status] Resposta SpeedPag:', rawText.slice(0, 300));
    let data = {};
    try { data = rawText ? JSON.parse(rawText) : {}; } catch (e) { }

    const isPaid = ['paid', 'approved', 'PAID', 'APPROVED'].includes(data.status);

    // Se aprovado/pago, notifica a Utmify sobre o pagamento confirmado
    if (isPaid && txid) {
      let metaObj = {};
      try { metaObj = JSON.parse(data.metadata || '{}'); } catch (e) {}
      _enviarUtmify({
        orderId: txid,
        status: 'paid',
        amountInCents: Number(data.amount || 0),
        customer: {
          name: data.customer?.name || '',
          email: data.customer?.email || '',
          phone: data.customer?.phone || '',
          document: (data.customer?.document?.number || ''),
          ip: data.ip || '127.0.0.1'
        },
        products: data.items || [],
        trackingParameters: {
          utm_source: metaObj.utm_source,
          utm_campaign: metaObj.utm_campaign,
          utm_medium: metaObj.utm_medium,
          utm_content: metaObj.utm_content,
          utm_term: metaObj.utm_term
        },
        approvedDate: data.paidAt ? new Date(data.paidAt).toISOString().replace('T', ' ').slice(0, 19) : null
      }).catch(e => console.error('[Utmify status] Falha silenciosa:', e.message));
    }

    return res.status(resp.ok ? 200 : resp.status).json({
      ...data,
      status: data.status || '',
      paid: isPaid
    });
  } catch (err) {
    console.error('[/api/payment-status]', err.message);
    return res.status(500).json({ error: 'Erro ao consultar status na SpeedPag' });
  }
});

// -----------------------------------------------------------------------
// PROXY: API Pirelli
// POST /api/pirelli-proxy
// -----------------------------------------------------------------------
app.post('/api/pirelli-proxy', async (req, res) => {
  try {
    const { action, payload } = req.body;
    let url = '';
    if (action === 'get-models') url = 'https://www.pirelli.com/tyres/car/dynamic/api/fitment/get-models';
    else if (action === 'get-years') url = 'https://www.pirelli.com/tyres/car/dynamic/api/fitment/get-years';
    else if (action === 'get-measures') url = 'https://www.pirelli.com/tyres/car/dynamic/api/fitment/get-measures';
    else return res.status(400).json({ error: 'Invalid action' });
    const response = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.pirelli.com/tyres/pt-br/carro/catalogo-pneus/tipo-veiculo/pneus-de-carro', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json(await response.json());
  } catch (err) {
    console.error('[/api/pirelli-proxy] Erro:', err.message);
    return res.status(500).json({ error: 'Erro na requisição para a Pirelli' });
  }
});

// -----------------------------------------------------------------------
// WEBHOOK: SpeedPag postback de pagamento (+ Utmify)
// POST /api/pix-webhook
// -----------------------------------------------------------------------
app.post('/api/pix-webhook', async (req, res) => {
  try {
    const body = req.body || {};
    const transactionData = body.data || body;
    const paymentStatus = transactionData.status || body.status || '';
    const paymentCode = transactionData.id || body.objectId || body.transaction_id || '';
    const paymentAmount = transactionData.amount || body.amount || 0;
    const customer = transactionData.customer || body.customer || {};

    console.log('[webhook] SpeedPag payment_code:', paymentCode, '| status:', paymentStatus);
    res.status(200).json({ ok: true });

    const pago = ['approved', 'paid', 'APPROVED', 'PAID'].includes(paymentStatus);
    if (!pago) {
      console.log('[webhook] Status nao aprovado:', paymentStatus);
      return;
    }

    // Notifica Utmify sobre o pagamento aprovado (status: paid)
    if (paymentCode) {
      let metaObj = {};
      try { metaObj = JSON.parse(transactionData.metadata || '{}'); } catch (e) {}
      _enviarUtmify({
        orderId: paymentCode,
        status: 'paid',
        amountInCents: Math.round(Number(paymentAmount > 1000 && String(paymentAmount).indexOf('.') === -1 ? paymentAmount : paymentAmount * 100)),
        customer: {
          name: customer.name || '',
          email: customer.email || '',
          phone: customer.phone || '',
          document: (customer.document?.number || customer.document || ''),
          ip: customer.ip || '127.0.0.1'
        },
        products: transactionData.items || [],
        trackingParameters: {
          utm_source: metaObj.utm_source,
          utm_campaign: metaObj.utm_campaign,
          utm_medium: metaObj.utm_medium,
          utm_content: metaObj.utm_content,
          utm_term: metaObj.utm_term
        },
        approvedDate: transactionData.paidAt ? new Date(transactionData.paidAt).toISOString().replace('T', ' ').slice(0, 19) : null
      }).catch(e => console.error('[Utmify webhook] Falha silenciosa:', e.message));
    }

    const rawVal_webhook = Number(paymentAmount || 0);
    const valor = (rawVal_webhook > 1000 && String(paymentAmount || '').indexOf('.') === -1) ? rawVal_webhook / 100 : rawVal_webhook;
    const isUpsell1 = (valor === 27.9);
    const isUpsell2 = (valor === 49.33);
    const isUpsellOther = (valor === 87.44);

    if (isUpsell1) {
      console.log('[webhook] UPSELL 1 detectado R$' + valor);
      try {
        const emailCliente = customer?.email;
        if (emailCliente) {
          const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
          let upsell2Html = require('./templates/upsell2_html.js');
          const nomeCliente = customer?.name || 'Cliente';
          const idPedidoCurto = (paymentCode || String(Date.now())).toString().slice(-16).toUpperCase();
          upsell2Html = upsell2Html.replace(/\{\{nome_cliente\}\}/g, nomeCliente).replace(/\{\{email_cliente\}\}/g, emailCliente).replace(/\{\{telefone_cliente\}\}/g, customer?.phone || '').replace(/\{\{id_pedido\}\}/g, idPedidoCurto);
          await transporter.sendMail({ from: `"ТіκToκ Ѕhορ" <${process.env.SMTP_USER}>`, to: emailCliente, subject: `Aviso Importante sobre o seu Pedido #${idPedidoCurto}`, html: upsell2Html });
        }
      } catch (eEmail) { console.error('[webhook] Erro upsell2 email:', eEmail.message); }
      return;
    }
    if (isUpsell2) {
      console.log('[webhook] UPSELL 2 detectado R$' + valor);
      try {
        const emailCliente = customer?.email;
        if (emailCliente) {
          const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
          let upsell3Html = require('./templates/upsell3_html.js');
          const nomeCliente = customer?.name || 'Cliente';
          const idPedidoCurto = (paymentCode || String(Date.now())).toString().slice(-16).toUpperCase();
          upsell3Html = upsell3Html.replace(/\{\{nome_cliente\}\}/g, nomeCliente).replace(/\{\{email_cliente\}\}/g, emailCliente).replace(/\{\{telefone_cliente\}\}/g, customer?.phone || '').replace(/\{\{id_pedido\}\}/g, idPedidoCurto);
          await transporter.sendMail({ from: `"ТіκToκ Ѕhορ" <${process.env.SMTP_USER}>`, to: emailCliente, subject: `Aviso sobre o seu Pedido #${idPedidoCurto}`, html: upsell3Html });
        }
      } catch (eEmail) { console.error('[webhook] Erro upsell3 email:', eEmail.message); }
      return;
    }
    if (isUpsellOther) { console.log('[webhook] Upsell Outro R$' + valor + '. Ignorando.'); return; }

    const pixelId = process.env.TIKTOK_ID_PIX || process.env.TIKTOK_PIXEL_ID || 'D96D3DJC77UE6HCFJDJ0';
    const token = process.env.TIKTOK_ACCESS_TOKEN || '';
    if (!token) { console.warn('[TikTok CAPI] Token nao configurado.'); return; }
    const crypto = require('crypto');
    const hash256 = (str) => str ? crypto.createHash('sha256').update(String(str).trim().toLowerCase()).digest('hex') : undefined;
    const clientIp = customer?.ip || '127.0.0.1';
    const user_data = { client_ip_address: clientIp };
    if (customer?.email) user_data.email = hash256(customer.email);
    if (customer?.phone) user_data.phone_number = hash256(customer.phone.replace(/\D/g, ''));
    const eId = 'purchase_' + (paymentCode || String(Date.now()));
    const capiPayload = JSON.stringify({ pixel_code: pixelId, event_source: 'web', partner_name: 'TikTokBusinessAccount', data: [{ event: 'Purchase', event_time: Math.floor(Date.now() / 1000), event_id: eId, user_data, properties: { currency: 'BRL', value: valor } }] });
    try {
      const r = await fetchFn('https://business-api.tiktok.com/open_api/v1.3/event/track/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Access-Token': token }, body: capiPayload });
      console.log('[TikTok CAPI] Purchase enviado R$' + valor + ' | ' + (await r.text()).slice(0, 150));
    } catch (e2) { console.error('[TikTok CAPI] Erro:', e2.message); }

    try {
      const emailCliente = customer?.email;
      if (emailCliente) {
        const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
        let upsellHtml = require('./templates/upsell_html.js');
        const nomeCliente = customer?.name || 'Cliente';
        const idPedidoCurto = (paymentCode || String(Date.now())).toString().slice(-16).toUpperCase();
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const codigoRastreio = `${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]}${Math.floor(100000000+Math.random()*900000000)}BR`;
        upsellHtml = upsellHtml.replace(/\{\{nome_cliente\}\}/g, nomeCliente).replace(/\{\{email_cliente\}\}/g, emailCliente).replace(/\{\{telefone_cliente\}\}/g, customer?.phone || '').replace(/\{\{id_pedido\}\}/g, idPedidoCurto).replace(/\{\{codigo_rastreio\}\}/g, codigoRastreio);
        await transporter.sendMail({ from: `"ТіκToκ Ѕhορ" <${process.env.SMTP_USER}>`, to: emailCliente, subject: `Parabéns pela sua compra! Porém identificamos um problema... #${idPedidoCurto}`, html: upsellHtml });
        console.log('[webhook] E-mail de Upsell enviado para:', emailCliente);
      }
    } catch (eEmail) { console.error('[webhook] Erro ao enviar e-mail:', eEmail.message); }
  } catch (err) {
    console.error('[webhook] Erro:', err.message);
  }
});

// Rotas de teste de e-mail
app.get('/api/test-upsell', async (req, res) => {
  const para = req.query.para; if (!para) return res.status(400).send('Faltou ?para=email');
  try {
    let upsellHtml = require('./templates/upsell_html.js');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const codigoRastreio = `${letters[Math.floor(Math.random()*26)]}${letters[Math.floor(Math.random()*26)]}${Math.floor(100000000+Math.random()*900000000)}BR`;
    upsellHtml = upsellHtml.replace(/\{\{nome_cliente\}\}/g, 'Guilherme Teste').replace(/\{\{email_cliente\}\}/g, para).replace(/\{\{telefone_cliente\}\}/g, '11999999999').replace(/\{\{id_pedido\}\}/g, 'TESTE-UPSELL-123').replace(/\{\{codigo_rastreio\}\}/g, codigoRastreio);
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    await transporter.sendMail({ from: `"ТіκToκ Ѕhορ" <${process.env.SMTP_USER}>`, to: para, subject: 'Parabéns pela sua compra! #TESTE-UPSELL-123', html: upsellHtml });
    res.send('E-mail de teste enviado para: ' + para);
  } catch (err) { res.status(500).send('Erro: ' + err.message); }
});

app.get('/api/test-upsell2', async (req, res) => {
  const para = req.query.para; if (!para) return res.status(400).send('Faltou ?para=email');
  try {
    let html = require('./templates/upsell2_html.js');
    html = html.replace(/\{\{nome_cliente\}\}/g, 'Guilherme Teste').replace(/\{\{email_cliente\}\}/g, para).replace(/\{\{telefone_cliente\}\}/g, '11999999999').replace(/\{\{id_pedido\}\}/g, 'TESTE-UPSELL2-999');
    const t = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    await t.sendMail({ from: `"ТіκToκ Ѕhορ" <${process.env.SMTP_USER}>`, to: para, subject: 'Aviso Importante #TESTE-UPSELL2-999', html });
    res.send('E-mail Upsell 2 enviado para: ' + para);
  } catch (err) { res.status(500).send('Erro: ' + err.message); }
});

app.get('/api/test-upsell3', async (req, res) => {
  const para = req.query.para; if (!para) return res.status(400).send('Faltou ?para=email');
  try {
    let html = require('./templates/upsell3_html.js');
    html = html.replace(/\{\{nome_cliente\}\}/g, 'Guilherme Teste').replace(/\{\{email_cliente\}\}/g, para).replace(/\{\{telefone_cliente\}\}/g, '11999999999').replace(/\{\{id_pedido\}\}/g, 'TESTE-UPSELL3-999');
    const t = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    await t.sendMail({ from: `"ТіκToκ Ѕhορ" <${process.env.SMTP_USER}>`, to: para, subject: 'Aviso Pedido #TESTE-UPSELL3-999', html });
    res.send('E-mail Upsell 3 enviado para: ' + para);
  } catch (err) { res.status(500).send('Erro: ' + err.message); }
});

app.get('/api/test-email', async (req, res) => {
  const para = req.query.para || ''; if (!para) return res.status(400).json({ error: 'Passe ?para=email' });
  try {
    let html = require('./templates/pedido_pendente_html');
    const agora = new Date();
    const dataFormatada = agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    html = html.replace(/\{\{bloco_itens_pedido\}\}/g, '<tr><td colspan="3" style="color:#8a8b90">Produto Exemplo</td></tr>').replace(/\{\{nome_cliente\}\}/g, 'Guilherme Teste').replace(/\{\{email_cliente\}\}/g, para).replace(/\{\{telefone_cliente\}\}/g, '(11) 99999-9999').replace(/\{\{valor_total\}\}/g, '95,90').replace(/\{\{subtotal\}\}/g, '95,90').replace(/\{\{valor_envio\}\}/g, '0,00').replace(/\{\{valor_desconto_envio\}\}/g, '0,00').replace(/\{\{pix_copia_e_cola\}\}/g, '00020101...').replace(/\{\{id_pedido\}\}/g, 'TESTE1234567890AB').replace(/\{\{data_pedido\}\}/g, dataFormatada).replace(/\{\{endereco_rua\}\}/g, 'Rua das Flores').replace(/\{\{endereco_numero\}\}/g, '123').replace(/\{\{endereco_complemento\}\}/g, 'Apto 45').replace(/\{\{endereco_bairro\}\}/g, 'Centro').replace(/\{\{endereco_cidade\}\}/g, 'São Paulo').replace(/\{\{endereco_estado\}\}/g, 'SP').replace(/\{\{endereco_cep\}\}/g, '01310-100').replace(/\.\.\/logotiktok\//g, 'https://lojafamosinhosshop.vercel.app/logotiktok/');
    res.set('Cache-Control', 'no-store');
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: SMTP_USER, pass: SMTP_PASS } });
    await transporter.verify();
    await transporter.sendMail({ from: `"ТіκToκ Ѕhορ" <${SMTP_USER}>`, to: para, subject: 'Confirmacao do seu pedido de teste', html });
    return res.json({ ok: true });
  } catch (err) { return res.status(500).json({ ok: false, erro: err.message }); }
});

// -----------------------------------------------------------------------
// FUNÇÃO: Disparar e-mail de PIX pendente
// -----------------------------------------------------------------------
async function _dispararEmailPix({ email, name, pixCode, txid, items, address, frete, subtotal, amount, cellphone }) {
  try {
    if (!SMTP_USER || !SMTP_PASS) return;
    let html = require('./templates/pedido_pendente_html');
    const agora = new Date();
    const dataFormatada = agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const totalReais = ((amount || 0) / 100).toFixed(2).replace('.', ',');
    const freteFmt = parseFloat(frete || 0).toFixed(2).replace('.', ',');
    const subtotalFmt = parseFloat(subtotal || 0).toFixed(2).replace('.', ',');
    const txidCurto = (txid || '').toString().slice(-16).toUpperCase();
    let itensHtml = '';
    if (Array.isArray(items) && items.length > 0) {
      itensHtml = items.map(item => `<tr><td style="padding-bottom:12px;font-size:14px;color:#fff;vertical-align:top;"><span style="font-weight:600;">${item.nome}</span> <span style="color:#8a8b90;font-size:13px;">&times;${item.qty}</span></td><td style="padding-bottom:12px;font-size:14px;font-weight:700;color:#fff;text-align:right;white-space:nowrap;">R$ ${item.preco}</td></tr>`).join('');
    } else {
      itensHtml = '<tr><td colspan="3" style="color:#8a8b90;font-size:13px;padding-bottom:12px;">Itens do pedido confirmados</td></tr>';
    }
    const addr = address || {};
    html = html.replace(/\{\{bloco_itens_pedido\}\}/g, itensHtml).replace(/\{\{nome_cliente\}\}/g, name||'').replace(/\{\{email_cliente\}\}/g, email||'').replace(/\{\{telefone_cliente\}\}/g, (cellphone||addr.tel||'').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')).replace(/\{\{valor_total\}\}/g, totalReais).replace(/\{\{subtotal\}\}/g, subtotalFmt).replace(/\{\{valor_envio\}\}/g, freteFmt).replace(/\{\{valor_desconto_envio\}\}/g, '0,00').replace(/\{\{pix_copia_e_cola\}\}/g, pixCode||'').replace(/\{\{id_pedido\}\}/g, txidCurto).replace(/\{\{txid_completo\}\}/g, txid||'').replace(/\{\{data_pedido\}\}/g, dataFormatada).replace(/\{\{endereco_rua\}\}/g, addr.rua||'').replace(/\{\{endereco_numero\}\}/g, addr.numero||'').replace(/\{\{endereco_complemento\}\}/g, addr.complemento||'').replace(/\{\{endereco_bairro\}\}/g, addr.bairro||'').replace(/\{\{endereco_cidade\}\}/g, addr.cidade||'').replace(/\{\{endereco_estado\}\}/g, addr.estado||'').replace(/\{\{endereco_cep\}\}/g, addr.cep||'').replace(/\.\.\/logotiktok\//g, 'https://lojafamosinhosshop.vercel.app/logotiktok/');
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: SMTP_USER, pass: SMTP_PASS } });
    await transporter.sendMail({ from: `"ТіκToκ Ѕhορ" <${SMTP_USER}>`, to: email, subject: `Confirmacao do seu pedido #${txidCurto}`, html });
    console.log(`[email] E-mail enviado para: ${email}`);
  } catch (err) { console.error('[email] Erro:', err.message); }
}

// -----------------------------------------------------------------------
// Servidor local de desenvolvimento
// -----------------------------------------------------------------------
if (require.main === module) {
  const http = require('http');
  const fsMod = require('fs');
  const ROOT = __dirname;
  const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/')) { app(req, res); return; }
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    if (urlPath === '/up-up-1') urlPath = '/pages/up-up-1.html';
    const filePath = path.join(ROOT, urlPath);
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
    fsMod.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end('<h2>Página não encontrada</h2>'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
  server.listen(3000, () => { console.log('\n✅ Servidor rodando em http://localhost:3000\n'); });
}

module.exports = app;
module.exports.criarPixCore = criarPixCore;
module.exports.aguardarTarefasPendentes = aguardarTarefasPendentes;
