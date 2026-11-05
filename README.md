# StarBuxx — projeto editável

Versão de entrega para Vercel, revisada em 05/11/2026. Comece por **LEIA-PRIMEIRO.md**.

## Executar localmente

Com Node 24 instalado:

```text
npm run build
npm start
```

Abra http://127.0.0.1:4175. A chave não é necessária para navegar. A demonstração de compra sem cobrança só fica disponível em localhost. Para PIX configure PURINCASH_API_KEY somente no ambiente do servidor.

## Publicar

Importe a pasta inteira que contém package.json e vercel.json na Vercel, configure PURINCASH_API_KEY e faça novo deploy. Não publique apenas dist. O build verifica sintaxe, os 405 produtos, imagens, rotas e correspondência de preços com o servidor.

## Estrutura

- dist: páginas, componentes JavaScript/CSS e mídias.
- api: funções Vercel de pagamento e consulta Roblox.
- server: preços do catálogo e integração PurinCash.
- scripts: build e conferência do pacote.
- tests: testes sem movimentar dinheiro.

## Verificação

```text
npm test
npm run check
```

14 testes de pagamento/cliente passaram na entrega. A revisão de build conferiu 405 páginas de produto, imagens locais, rotas e preços. A última verificação visual no navegador integrado foi limitada por conexão recusada/timeout do servidor local; a conferência responsiva anterior é documentada nos registros de cada área.

## Limites da versão

PIX integrado e consulta autenticada de pagamento; entrega de produtos não automatizada. Histórico local ao navegador, sem banco de pedidos ou login comercial. Ranking/carteira/Discord são apresentações sem integração operacional. As demonstrações de God Human utilizam GIFs remotos da referência e dependem da origem. Mídias reaproveitadas com autorização informada pelo usuário. Não há chave secreta ou dados pessoais de clientes neste pacote.

Consulte PURINCASH-VERCEL.md para operação, limites e fontes oficiais.
