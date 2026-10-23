$rootDir = 'c:\Users\eduar\OneDrive\Documentos\TT'

$files = @(
    "$rootDir\templates\pedido_pendente_html.js",
    "$rootDir\templates\upsell_html.js",
    "$rootDir\templates\upsell2_html.js",
    "$rootDir\templates\upsell3_html.js"
)

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file)
    # Substitui versao escapada no JS stringificado
    $newContent = $content.Replace('alt=\\\"TikTok Shop\\\"', 'alt=\\\"Famosinhos Shop\\\"')
    $newContent = $newContent.Replace('"TikTok Shop"', '"Famosinhos Shop"')
    $newContent = $newContent.Replace('TikTok Shop <', 'Famosinhos Shop <')
    if ($newContent -ne $content) {
        [System.IO.File]::WriteAllText($file, $newContent)
        Write-Host "Atualizado: $(Split-Path $file -Leaf)"
    } else {
        Write-Host "Sem alteracoes: $(Split-Path $file -Leaf)"
    }
}
Write-Host "Concluido!"
