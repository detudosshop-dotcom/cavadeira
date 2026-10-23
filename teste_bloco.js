async function testWebhook(req, res) {
  try {
    const body = req.body || {};
    console.log('[webhook] payment_code:', body.payment_code, '| status:', body.payment_status);

    res.status(200).json({ ok: true });

    const pago = (body.payment_status === 'approved' || body.payment_status === 'paid' || body.payment_status === 'APPROVED' || body.payment_status === 'PAID');
    if (!pago) { return; }

    const pixelId = process.env.TIKTOK_PIXEL_ID || 'D96D3DJC77UE6HCFJDJ0';
    const token = process.env.TIKTOK_ACCESS_TOKEN || '';
    if (!token) { return; }

    const rawVal = Number(body.payment_amount || 0);
    const valor = (rawVal > 1000 && String(body.payment_amount || '').indexOf('.') === -1) ? rawVal / 100 : rawVal;
    const eId = 'purchase_' + (body.payment_code || body.external_code || String(Date.now()));
    const payload = { pixel_code: pixelId, event_source: 'web', data: [{ event: 'Purchase', event_time: Math.floor(Date.now() / 1000), event_id: eId, properties: { currency: 'BRL', value: valor } }] };

    try {
      const fetchFn = fetch;
      const r = await fetchFn('https://business-api.tiktok.com/open_api/v1.3/event/track/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Access-Token': token }, body: JSON.stringify(payload) });
      const d = await r.text();
      console.log('[TikTok CAPI] Resp:', d.slice(0, 150));
    } catch (e2) { console.error('[TikTok CAPI] Erro:', e2.message); }

  } catch (err) {
    console.error('[webhook] Erro:', err.message);
  }
}