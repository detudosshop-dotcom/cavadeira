const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmacao do seu pedido</title>
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

          <h1 style="font-size:26px;font-weight:800;margin:0 0 12px 0;color:#111111;">Detalhes do seu pedido</h1>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 6px 0;">
            Ola, <strong>{{nome_cliente}}</strong>!
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 28px 0;">
            Seu pedido foi recebido com sucesso! 🎉<br><br>
            Agora falta apenas um último passo para concluir sua compra.<br><br>
            Para que seu pedido seja preparado e entregue no endereço informado, é necessário realizar o pagamento utilizando o PIX abaixo.<br><br>
            Assim que o pagamento for confirmado, iniciaremos a separação do seu pedido e daremos sequência ao processo de envio.
          </p>

          <!-- Box PIX -->
          <div style="background-color:#fff5f7;border:1px solid #fe2c55;border-radius:8px;padding:20px;margin-bottom:28px;text-align:center;">
            <div style="font-size:14px;font-weight:700;color:#fe2c55;letter-spacing:1px;margin-bottom:8px;">CODIGO DE PAGAMENTO</div>
            <div style="font-size:34px;font-weight:800;color:#111111;margin-bottom:16px;">R$ {{valor_total}}</div>
            <p style="font-size:13px;color:#555555;margin:0 0 12px 0;line-height:18px;">
              Copie o codigo abaixo e utilize a opcao PIX Copia e Cola no aplicativo do seu banco:
            </p>
            <!-- Codigo PIX - cor unica escura sem link azul -->
            <div style="background-color:#f5f5f5;border:1px solid #dddddd;border-radius:6px;padding:14px;margin-bottom:14px;word-break:break-all;font-family:monospace;font-size:12px;color:#222222;text-align:left;line-height:18px;">{{pix_copia_e_cola}}</div>
            <p style="font-size:13px;color:#888888;margin:0;line-height:18px;">Pressione e segure o codigo acima para seleciona-lo e copiar.</p>
          </div>

          <div style="border-top:1px solid #eeeeee;margin:24px 0;"></div>

          <!-- Informacoes do pedido -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td colspan="2" style="font-size:16px;font-weight:700;color:#111111;padding-bottom:12px;">Informacoes do pedido</td></tr>
            <tr>
              <td style="font-size:14px;color:#888888;padding-bottom:6px;" width="40%">ID do pedido</td>
              <td style="font-size:14px;color:#111111;padding-bottom:6px;font-weight:600;" width="60%">{{id_pedido}}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#888888;">Data do pedido</td>
              <td style="font-size:14px;color:#111111;">{{data_pedido}}</td>
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

          <div style="border-top:1px solid #eeeeee;margin:24px 0;"></div>

          <!-- Valores -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#888888;">Subtotal</td>
              <td align="right" style="padding:6px 0;font-size:14px;color:#111111;">R$ {{subtotal}}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#888888;">Envio</td>
              <td align="right" style="padding:6px 0;font-size:14px;color:#111111;">R$ {{valor_envio}}</td>
            </tr>
            <tr>
              <td style="padding-top:12px;font-size:16px;font-weight:700;color:#111111;border-top:1px solid #eeeeee;">Total</td>
              <td align="right" style="padding-top:12px;font-size:16px;font-weight:700;color:#111111;border-top:1px solid #eeeeee;">R$ {{valor_total}}</td>
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

const output = `// Template HTML em String Literal para contornar problemas de empacotamento do Vercel Serverless\nmodule.exports = ${JSON.stringify(html)};\n`;
fs.writeFileSync(path.join(__dirname, 'pedido_pendente_html.js'), output, 'utf8');
console.log('Template gerado com sucesso!');
