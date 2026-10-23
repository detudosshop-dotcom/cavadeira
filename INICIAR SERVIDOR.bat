@echo off
title Famosinhos Shop - Servidor Local
color 0A
cls
echo.
echo  ==========================================
echo   FAMOSINHOS SHOP - Iniciando servidor...
echo  ==========================================
echo.
echo  Aguarde, abrindo o navegador...
echo.
node "%~dp0server.js"
echo.
echo  Servidor encerrado. Pressione qualquer tecla para fechar.
pause >nul
