# Subir na Vercel

1. Extraia o ZIP completo. Use como raiz do projeto a pasta com **package.json**, **vercel.json**, **api**, **server** e **dist**. Não envie apenas dist.
2. Importe o projeto na Vercel, pelo seu repositório ou Vercel CLI. O vercel.json já define Node 24, build e páginas. Se a tela pedir Framework Preset, selecione **Other**.
3. Em **Settings → Environment Variables**, adicione **PURINCASH_API_KEY**, com a sua chave PurinCash. Use primeiro uma chave de teste (ps_test_). Não coloque a chave no código nem em variáveis públicas.
4. Faça **Redeploy** depois de salvar a variável. Teste produto → carrinho → dados → Gerar PIX. Só depois use a chave de produção (ps_live_) no ambiente Production e faça novo deploy.

## Incluído

Site editável, imagens e vídeos locais disponíveis, páginas de todos os produtos, perfil Roblox, área da conta, carrinho, checkout PIX, QR Code/copia e cola e consulta de pagamento. Os 30% de desconto foram mantidos.

## Antes de atender clientes

O PIX está preparado para a API, mas não houve validação ao vivo sem a sua chave nem deploy autenticado na sua conta Vercel. Faça um teste sandbox de ponta a ponta antes de habilitar produção.

A entrega de Robux, contas e gift cards não é automática. O histórico do comprador é local ao navegador; não há banco de pedidos nem login comercial. Ranking, carteira e conexão Discord continuam sem integração operacional. Veja PURINCASH-VERCEL.md para os limites e a operação manual.

Se a API falhar, a finalização é bloqueada. Sem chave em localhost o site pode ser usado em demonstração; sem chave no domínio publicado, o pagamento fica indisponível.

## Arquivos principais

- dist/: interface e mídias.
- api/: funções para Vercel.
- server/: integração PurinCash e catálogo de preços validado no servidor.
- scripts/build.mjs: prepara o catálogo de pagamento.
- tests/: verificações sem movimentar dinheiro.
- PURINCASH-VERCEL.md: documentação da integração.

Não há chave privada dentro do ZIP.
