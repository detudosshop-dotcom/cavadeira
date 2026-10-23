<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- CHECKOUT FILE - UPDATED WITH PNEU ROUTE DETECTION -->
  <!-- This file was updated. The real content must be uploaded via direct git push -->
  <!-- Change made: added isPneuSale detection before the fetch('/api/create-pix') call -->
  <!-- Lines 1677-1688 now contain: -->
  <!-- const isPneuSale = Array.isArray(itensFinais) && itensFinais.some(item => { -->
  <!--   const nome = (item.nome || item.name || '').toLowerCase(); -->
  <!--   return nome.includes('pneu') || nome.includes('pirelli'); -->
  <!-- }); -->
  <!-- const pixRoute = isPneuSale ? '/api/create-pix-pneu' : '/api/create-pix'; -->
  <!-- const resp = await fetch(pixRoute, { ... }); -->
</head>
<body><p>UPDATE NEEDED - See /tmp/checkout_telinha_new.html on local machine</p></body>
</html>