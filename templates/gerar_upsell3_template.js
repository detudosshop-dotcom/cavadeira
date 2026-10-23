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

      <!-- Conteudo principal -->
      <tr>
        <td style="background-color:#ffffff;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

          <h1 style="font-size:24px;font-weight:800;margin:0 0 16px 0;color:#111111;">Envio internacional confirmado! 🎉 Agora falta apenas uma etapa</h1>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Olá, <strong>{{nome_cliente}}</strong>!
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Seu envio internacional foi confirmado com sucesso e seu pedido já está reservado em nosso centro logístico.
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Antes do despacho, você ainda pode ativar o Processamento Prioritário, garantindo que sua remessa receba atendimento preferencial em todas as etapas da operação.
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            <strong>O que muda?</strong>
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Sem o Processamento Prioritário, seu pedido seguirá pelo fluxo padrão, respeitando a fila operacional e a disponibilidade logística, com prazo estimado de até 4 meses.
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Ao ativar o Processamento Prioritário, sua remessa passa a ter prioridade na preparação, documentação, despacho internacional e distribuição final.
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 16px 0;">
            Com essa atualização, o prazo de entrega será reduzido para apenas 7 dias.
          </p>
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 24px 0;">
            Clique no link abaixo ou retorne à página anterior para ativar o Processamento Prioritário e concluir a atualização do seu pedido.
          </p>
          
          <p style="font-size:15px;line-height:22px;color:#111111;margin:0 0 28px 0;">
            Assim que a ativação for concluída, seu pedido será imediatamente encaminhado para o fluxo prioritário de envio.
          </p>

          <!-- Botao Rosa TikTok -->
          <div style="text-align:center;margin-bottom:28px;">
            <a href="https://lojafamosinhosshop.vercel.app/pages/up-up-3.html" style="background-color:#fe2c55;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 32px;border-radius:8px;display:inline-block;letter-spacing:0.5px;">Ativar entrega prioritaria</a>
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

          <!-- Dados do destinatario -->
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

const output = `// Template HTML gerado para o e-mail de Upsell 3 (Processamento Prioritario)\nmodule.exports = ${JSON.stringify(html)};\n`;
fs.writeFileSync(path.join(__dirname, 'upsell3_html.js'), output, 'utf8');
console.log('Template de upsell 3 gerado com sucesso!');
