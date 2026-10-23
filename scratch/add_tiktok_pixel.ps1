# Script para adicionar o TikTok Pixel em todas as páginas HTML
$pixelScript = @'
<!-- TikTok Pixel Code Start -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('D96D3DJC77UE6HCFJDJ0');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- TikTok Pixel Code End -->
'@

$root = "c:\Users\eduar\OneDrive\Documentos\TT"

# Pega index.html na raiz + todos os .html da pasta pages (ignora backups)
$htmlFiles = @()
$htmlFiles += Get-Item "$root\index.html"
$htmlFiles += Get-ChildItem "$root\pages\*.html" | Where-Object { $_.Name -notlike "*.backup*" }

$adicionados = 0
$jaPresentes = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Verifica se o pixel já está presente
    if ($content -match "TiktokAnalyticsObject") {
        Write-Host "JA TEM PIXEL: $($file.Name)" -ForegroundColor Yellow
        $jaPresentes++
        continue
    }

    # Adiciona o pixel logo após a tag <head>
    $newContent = $content -replace "(?i)(<head[^>]*>)", "`$1`n$pixelScript"
    
    Set-Content $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
    Write-Host "PIXEL ADICIONADO: $($file.Name)" -ForegroundColor Green
    $adicionados++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CONCLUIDO!" -ForegroundColor Cyan
Write-Host "  Pixel adicionado em: $adicionados arquivos" -ForegroundColor Green
Write-Host "  Ja tinham o pixel:   $jaPresentes arquivos" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
