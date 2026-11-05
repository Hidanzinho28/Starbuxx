# Revisão final — 05/11/2026

- Carrinho respeita a disponibilidade anunciada de contas e o limite de unidades; remove itens arquivados de carrinhos antigos.
- Finalização bloqueada em caso de API indisponível, sem simular um pagamento no domínio publicado.
- Carregamento do checkout e avisos de falha mais claros.
- Consulta PIX não reabre a janela depois de fechada; atualização respeita a visibilidade da página.
- Pedidos ordenados pelos mais recentes e consulta dos pagamentos preservada.
- Ajustes de foco, contraste de textos, áreas de toque, campos no celular, números e quebras de linha.
- Favicon, cor do navegador, link de pular para o conteúdo e mensagem sem JavaScript.
- Textos antigos de demonstração ajustados ao fluxo de pagamento atual.
- Vercel com fallback das páginas e 404 para arquivos/API ausentes.
- Verificados 405 produtos, recursos locais e preços do servidor; 14 testes passaram.

Não foram realizadas cobranças reais nem deploy autenticado. A chave deve ser inserida na Vercel pelo titular. Teste sandbox ainda necessário na conta PurinCash. A última prévia visual não carregou por limitação de conexão local nesta sessão.
