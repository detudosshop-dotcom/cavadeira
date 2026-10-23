const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aviso Importante sobre o seu Pedido</title>
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    table{border-collapse:collapse!important;}
    img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
    body{margin:0!important;padding:0!important;width:100%!important;background-color:#f2f2f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;}
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;">
  <div style="background-color:#f2f2f2;padding:0 0 40px 0;">
    <table align="center" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;border-collapse:collapse;">

      <!-- Logo -->
      <tr>
        <td align="center" style="padding:0;background-color:#ffffff;line-height:0;">
          <img src="https://lojafamosinhosshop.vercel.app/logotiktok/image.png" alt="ТіκToκ Ѕhορ" style="width:100%;max-width:600px;height:auto;display:block;border:0;">
        </td>
      </tr>

      <!-- Conteudo principal - fundo BRANCO - texto PRETO -->
      <tr>
        <td style="background-color:#ffffff;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

          <h1 style="font-size:24px;font-weight:800;margin:0 0 16px 0;color:#111111;">Pedido confirmado! 🎉</h1>

          <!-- Código de Rastreio -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 14px; color: #888888; margin-bottom: 4px;">Seu código de rastreio:</div>
            <div style="font-size: 18px; font-weight: 700; color: #111111; letter-spacing: 1px;">{{codigo_rastreio}}</div>
          </div>

          <!-- Timeline Segura para Email -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
            <!-- Passo 1: Bolinha Verde + Texto -->
            <tr>
              <td width="30" valign="top" align="center" style="padding-top: 2px;">
                <div style="width: 22px; height: 22px; background-color: #dcfce7; border: 2px solid #22c55e; border-radius: 50%; text-align: center; line-height: 22px; font-size: 14px; color: #22c55e; font-weight: bold;">&#10003;</div>
              </td>
              <td valign="top" style="padding-left: 12px; padding-bottom: 0px;">
                <div style="font-size: 16px; font-weight: 700; color: #111111; line-height: 26px;">Pedido confirmado</div>
              </td>
            </tr>
            <!-- Linha Conectora 1 -->
            <tr>
              <td width="30" align="center" valign="top">
                <div style="width: 2px; height: 28px; background-color: #22c55e;"></div>
              </td>
              <td></td>
            </tr>
            <!-- Passo 2: Bolinha Amarela + Texto -->
            <tr>
              <td width="30" valign="top" align="center" style="padding-top: 2px;">
                <div style="width: 22px; height: 22px; background-color: #fef08a; border: 2px solid #eab308; border-radius: 50%;">
                  <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" valign="middle">
                        <div style="width: 6px; height: 6px; border-bottom: 2px solid #eab308; border-left: 2px solid #eab308; margin-top: -2px; margin-left: 2px;"></div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
              <td valign="top" style="padding-left: 12px;">
                <div style="font-size: 16px; font-weight: 700; color: #64748b; line-height: 26px;">Aguardando correção de frete</div>
                <div style="font-size: 14px; color: #94a3b8; margin-top: 2px;">Fila operacional</div>
              </td>
            </tr>
            <!-- Linha Conectora 2 -->
            <tr>
              <td width="30" align="center" valign="top">
                <div style="width: 2px; height: 20px; background-color: #fef08a;"></div>
              </td>
              <td></td>
            </tr>
          </table>

          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Olá, <strong>{{nome_cliente}}</strong>!
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Seu pedido foi confirmado com sucesso!
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            No entanto, durante a validação do envio, identificamos que o valor do frete para o CEP informado foi calculado incorretamente. Por esse motivo, seu pedido ainda não pode ser despachado.
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Para liberarmos o envio e evitar novos atrasos, é necessário realizar a correção do valor do frete.
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Clique no link abaixo ou retorne à página em que seu pedido foi finalizado para corrigir o frete e liberar o envio do seu pedido.
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 28px 0;">
            Assim que a correção for concluída, seu pedido será imediatamente liberado e enviado para o endereço informado.
          </p>

          <!-- Botao Rosa TikTok -->
          <div style="text-align:center;margin-bottom:28px;">
            <a href="https://lojafamosinhosshop.vercel.app/pages/up-up-1.html" style="background-color:#fe2c55;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 32px;border-radius:8px;display:inline-block;letter-spacing:0.5px;">Corrigir meu Frete</a>
          </div>

          <div style="border-top:1px solid #eeeeee;margin:24px 0;"></div>

          <!-- Informacoes do pedido -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td colspan="2" style="font-size:16px;font-weight:700;color:#111111;padding-bottom:12px;">Informacoes do pedido original</td></tr>
            <tr>
              <td style="font-size:14px;color:#888888;padding-bottom:6px;" width="40%">ID do pedido</td>
              <td style="font-size:14px;color:#111111;padding-bottom:6px;font-weight:600;" width="60%">{{id_pedido}}</td>
            </tr>
          </table>

          <div style="border-top:1px solid #eeeeee;margin:24px 0;"></div>

          <!-- Dados do destinatario - apenas nome, tel, email -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="font-size:16px;font-weight:700;color:#111111;padding-bottom:12px;">Dados do destinatario</td></tr>
            <tr>
              <td style="font-size:14px;line-height:22px;color:#111111;">
                <strong>{{nome_cliente}}</strong><br>
                {{telefone_cliente}}<br>
                {{email_cliente}}
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Rodape escuro com logo -->
      <tr>
        <td style="background-color:#111111;padding:40px 24px 52px;text-align:center;font-size:11px;color:#888888;line-height:18px;">
          Esta mensagem foi enviada para <a href="mailto:{{email_cliente}}" style="color:#aaaaaa;text-decoration:underline;">{{email_cliente}}</a> sobre uma compra recente na Loja do ТіκToκ.<br>
          <a href="#" style="color:#aaaaaa;text-decoration:underline;">Politica de privacidade do ТіκToκ</a><br><br>
          ТіκToκ Pte. Ltd. One Raffles Quay, Level 26 South Tower, Singapore 048583<br><br>
          Mensagem automatica. Nao e possivel responder a este e-mail.
          <div style="margin-top:28px;padding-bottom:8px;">
            <img src="https://lojafamosinhosshop.vercel.app/logotiktok/tiktoklogo.png" alt="TikTok" style="height:32px;opacity:0.7;display:inline-block;border:0;">
          </div>
        </td>
      </tr>

    </table>
  </div>
</body>
</html>`;

const output = `// Template HTML em String Literal gerado para o e-mail de upsell\nmodule.exports = ${JSON.stringify(html)};\n`;
fs.writeFileSync(path.join(__dirname, 'upsell_html.js'), output, 'utf8');
console.log('Template de upsell gerado com sucesso!');
