# PurinCash + Vercel

Integração PIX preparada conforme a documentação consultada em 04/11/2026. Nenhuma chave foi incluída no projeto e nenhuma cobrança real foi feita durante o desenvolvimento.

## Publicar

1. Importe este projeto completo na Vercel. A raiz deve ser a pasta que contém `package.json`, `vercel.json`, `api`, `server` e `dist`. Não publique somente `dist`.
2. Em **Settings > Environment Variables**, adicione **PURINCASH_API_KEY** com a chave da sua conta PurinCash. É a única variável necessária para esta integração.
3. Use uma chave `ps_test_` para testar. A chave `ps_live_` ativa cobranças reais. Salve a variável no ambiente desejado e faça um novo deploy.
4. O build, as funções e o fallback das páginas já estão em `vercel.json`. Node 24, sem dependências adicionais.
5. Abra um produto, adicione ao carrinho, informe e-mail e usuário, revise e clique em **Gerar PIX para pagamento**. Teste primeiro com a chave sandbox. Não publique uma chave real em preview público se quiser manter os testes isolados.

## O que funciona

- Todos os itens existentes e pacotes de Robux usam o mesmo checkout PIX.
- Preço e quantidade são conferidos no servidor, a partir do catálogo gerado no build. Preços enviados pelo navegador são ignorados. Mantidos os 30% de desconto, arredondamento em centavos e mínimo de 587 Robux/R$ 15,00.
- POST autenticado em `/v1/charges`, QR Code e copia e cola, expiração, status consultado por GET autenticado em `/v1/charges/{paymentId}`.
- O gateway determina o ambiente pela chave. PIX sandbox é identificado como teste e não é pagável.
- Consulta automática a cada 15 segundos enquanto o modal está aberto. A página Meus pedidos reconcilia até cinco pendentes ao abrir. Não existe botão que marque um pagamento real como pago.
- Pedido inclui itens, e-mail e usuário Roblox. Metadata na PurinCash guarda referência, usuário e itens compactos; customer guarda o e-mail. Não são enviados senha, cookie ou token Roblox.
- Histórico PIX em `purincash-orders` no armazenamento local. Pode reabrir o PIX pelos pedidos. Notificações e visão geral leem esse histórico.
- `/api/roblox/user` também está preparado como função Vercel.

## Como basta uma chave

Esta versão usa a consulta de status, alternativa documentada pela PurinCash ao webhook. Não precisa configurar callbackUrl, domínio em variável ou webhook secret. Não foi criado um webhook sem validação. Os comprovantes de consulta são assinados no servidor com uma chave derivada da API key; a API key nunca vai para o navegador. Rotacionar a chave invalida comprovantes antigos; cobranças continuam no painel PurinCash.

## Limites importantes

- Cobrança e confirmação PIX estão integradas; entrega automática de Robux, contas, códigos de gift card, e-mail, reserva de estoque, rank e carteira não estão. Pagar não significa receber automaticamente um item. A operação e entrega precisam ser acompanhadas pelo responsável no painel PurinCash; os detalhes do pedido ficam na metadata.
- Sem banco de dados ou login comercial: os pedidos mostrados no site dependem deste navegador. Não há painel administrativo multiusuário, recuperação por e-mail nem histórico entre dispositivos. O registro financeiro permanece na PurinCash. Apagar dados do navegador remove o acesso local ao recibo.
- Confirmação é por consulta, enquanto o comprador abre o PIX/histórico; não existe processamento em segundo plano após fechar o site. Automação de entrega independente do navegador exige persistência, fila e webhook autenticado em uma etapa posterior.
- Não há idempotência durável de criação sem armazenamento adicional. O botão fica bloqueado depois da primeira tentativa e não há retry automático de POST. Se houver timeout de criação, confira a cobrança no painel antes de repetir. Uma cobrança é uma solicitação PIX; só há pagamento quando o comprador efetivamente paga.
- O mínimo documentado da PurinCash é R$ 0,80 e sua conta pode ter mínimo maior. Carrinhos abaixo de R$ 0,80 são recusados, sem alterar preço dos produtos. Há teto local de R$ 100 mil e 20 itens diferentes por solicitação.
- Não usamos endpoints de saque, carteira do lojista ou transferências. Cartão e cripto não foram implementados nesta etapa.
- Sem chave, o fluxo é demonstrativo apenas em localhost; no domínio publicado a finalização fica indisponível. Falha de pagamento com chave não vira pedido pago/demonstração.

## Testes

`npm run build` regenera o catálogo. `npm test` valida preços, desconto, estoque anunciado, adulteração de recibos, comparação de valores, falhas parciais e ausência de chave com respostas simuladas. Não houve teste autenticado ao vivo ou deploy na Vercel sem uma chave fornecida pelo titular. Após configurar ps_test_, faça o fluxo sandbox e simule o pagamento pelo painel/API da PurinCash.

## Fontes

- https://docs.purincash.com/api-reference/cobrancas/create-charge
- https://docs.purincash.com/api-reference/cobrancas/get-charge
- https://docs.purincash.com/webhooks/visao-geral
- https://docs.purincash.com/webhooks/assinatura
- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/project-configuration/vercel-json
