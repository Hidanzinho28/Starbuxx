# Fluxo de compra

Finalização unificada para todos os produtos, Gift Cards, contas e Robux. Campos obrigatórios: e-mail válido, usuário Roblox (até 20 caracteres, letras, números e sublinhado) e conferência dos dados. O usuário pode consultar o perfil público e avatar pelo endpoint Roblox existente; essa consulta não autentica nem comprova titularidade.

Etapas: dados e resumo, revisão com possibilidade de voltar, confirmação com referência única e total. O carrinho preserva alterações posteriores e remove somente as quantidades confirmadas. Pedidos de demonstração ficam em sessionStorage (máximo dez), limitado à sessão do navegador. Nenhum e-mail é enviado. Os dados não são enviados a um servidor de pedidos ou serviço de pagamento; somente a consulta opcional do nome público usa a API Roblox.

Arquivos: dist/checkout.js, dist/checkout.css; integração em dist/app.js, dist/robux-page.js e dist/index.html. O fluxo usa os preços já reduzidos em 30%.

Verificado no navegador com dados fictícios: campos vazios impedem avanço, revisão de e-mail e usuário, confirmação com identificador e total R$ 25,55 para 1.000 Robux, e contador do carrinho zerado após confirmar. Consulta Roblox reutiliza o backend público já existente e requer o servidor aberto.

Para vendas reais ainda faltam backend persistente de pedidos, pagamento, confirmação de pagamento, envio de e-mail e entrega/estoque. O formulário e a confirmação informam que são uma demonstração local.

Avatar automático: consulta após 850ms sem digitação, com mínimo de três caracteres; mostra carregamento, avatar e nome público. Respostas antigas são descartadas, buscas anteriores canceladas e perfis ficam em cache por cinco minutos. Perfis já preenchidos também são consultados ao abrir. O botão permite tentar novamente se a consulta falhar.

## Meus pedidos
A rota /meus-pedidos lê local-orders da sessão do navegador usada no checkout. Possui busca por nome/ID, filtros de status, itens, total e detalhes. Pedidos demonstrativos ficam identificados como demonstração e aparecem em Todos, sem simular pagamento ou entrega. O histórico não é compartilhado entre abas/sessões e não há backend comercial. Link disponível no cabeçalho e na confirmação da compra.

## Minha conta e navegação
Cabeçalho com sino, carrinho e botão de perfil/saldo. Menu Minha Conta acessível pelo avatar, fechado por Escape, botão ou clique fora. Atalhos para visão geral /minha-conta, pedidos e configurações. Saldo/ranking são apresentados como indisponíveis nesta demonstração; sem inventar recompensas ou transações. Visão geral mostra perfil público selecionado, pedidos recentes e total demonstrativo da sessão. Sair remove o perfil selecionado. Navegação inferior móvel: início, Robux, loja e contas, com rota ativa. Conferido no navegador em 390px sem transbordamento horizontal.

Perfil refinado conforme captura fornecida: rota /perfil (alias /minha-conta preservado), barra lateral, avatar, cartões de métricas, prévia visual do rank Bronze, oferta amarela e seção Discord. Estatísticas sociais não consultadas aparecem com traço; total gasto real permanece zero porque pedidos são demonstrativos. Prévia de ranking não aplica descontos extras. Link Discord abre comunidade e não simula OAuth. Conferido em 1476px e 390px, sem transbordamento horizontal móvel.

Dados públicos Roblox: backend consulta users.roblox.com/v1/users/{id} para a bio e friends.roblox.com/v1/users/{id}/{friends,followers,followings}/count para contagens. Sem senha/cookies. Chamadas em paralelo, falhas parciais como null, atualização automática ao abrir /perfil com cache de cinco minutos. Reiniciar server.mjs após esta atualização. Conferência por respostas simuladas para contagens, valores zero, bio vazia e falha parcial; consulta ao vivo depende do servidor reiniciado e da disponibilidade do Roblox.

## Áreas da conta
Rotas /perfil/configuracoes, /perfil/notificacoes, /perfil/ranking e /perfil/saldo. Preferências em account-preferences no localStorage: nome de exibição local, e-mail (preenche checkout) e avisos de pedidos. Notificações derivadas dos pedidos da sessão; leitura em read-order-notifications. Ranking e carteira continuam sem integração financeira. A página original de configurações redirecionou a /auth; layout desenvolvido com o estilo das referências visuais fornecidas, sem alegar cópia de uma tela privada não inspecionada.
