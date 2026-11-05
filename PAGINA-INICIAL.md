# Página inicial

A rota `/` agora tem uma página própria, baseada na inspeção de `https://star-buxx.com/` em 03/11/2026. A loja continua em `/loja`. As logos do cabeçalho e rodapé, além dos links de início, apontam para `/`.

## Áreas implementadas

- Carrossel de cinco banners: Robux Via Plus, contas Blox Fruits, gamepasses, MM2 e Robux Via Gamepass.
- Imagens originais locais, transição entre banners, setas, indicadores e controle de pausa. Troca automática a cada 6,5 segundos, desativada com movimento reduzido e pausada quando a aba ou o destaque não está visível. Hover e foco também pausam a troca.
- Seção de como comprar, com a capa original e o vídeo original incorporado do YouTube somente após clicar para assistir.
- Três etapas de orientação e vitrine de Robux, gamepasses/frutas e contas.
- Comunidade com link para o Discord original, perguntas expansíveis e chamada final.
- Layout responsivo e imagens carregadas sob demanda.

## Arquivos

### Revisão de movimento

`dist/landing-motion.css` acrescenta os efeitos identificados na inspeção adicional do original: título por palavras com blur de 7 px, degradês em 2,8 s, brilho dos selos em 4,8 s e bordas de botão com gradiente cônico em rotação. As etapas entram de 18 px, a vitrine de 30 px, e o bloco de vídeo aparece com escala 0,98. Há inclinação suave dos cartões no hover e ícones com órbita/counter-rotação de 35 s na chamada final. Os tempos não expostos no original foram aproximados.

O controle por visibilidade foi estendido aos novos elementos em `motion.js`; movimento reduzido desliga os efeitos. O carrossel mantém a troca automática com o mouse sobre o banner e pausa ao receber foco, sair da tela, ocultar a aba ou pelo botão de pausa.

Os efeitos de degradê, selos, bordas e órbita foram verificados nos estilos calculados no navegador. As entradas ao rolar e a composição da chamada final foram conferidas visualmente. Os testes de carrossel e ciclo de animações passaram.

`dist/landing.js`, `dist/landing.css` e `dist/home-media.js`. As novas imagens constam do inventário em `dist/assets/original/manifest.json`. O vídeo explicativo é um embed externo, não um download.

## Limites

Os textos foram adaptados ao projeto existente. Avaliações de clientes, vendas ao vivo e números de comunidade do original não foram reproduzidos como dados desta loja. A página usa os mesmos fluxos de catálogo, conta e carrinho já existentes; não acrescenta pagamentos, entregas nem autenticação reais.

## Verificação

Conferidos no navegador: abertura da home, troca do banner, link Loja, retorno pela logo, carregamento do iframe de vídeo e layout móvel sem rolagem horizontal. O console não apresentou erros no teste de navegação. Os testes automatizados verificaram cinco banners, arquivos locais, slide ativo/inativo, pausa com aba oculta, limpeza dos temporizadores e destino das logos.

Para visualizar no servidor já aberto, atualize com Ctrl+F5 e clique na logo. Não é necessário reiniciar o processo Node.
