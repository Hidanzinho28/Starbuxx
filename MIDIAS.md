# Mídias incorporadas — revisão de 03/11/2026

Autorização de reutilização confirmada pelo usuário nesta conversa. Os arquivos foram exportados das páginas públicas da loja, Blox Fruits, Brainrot e MM2. O inventário técnico está em `dist/assets/original/manifest.json`. Este documento substitui as notas de mídias da primeira versão do README.

## Mídias principais

- Banner da loja: `roblox-banner-bg-v2-DT8GnSF7.webm`, com a capa original.
- Painel de contas Blox Fruits e destaque da categoria: `bloxfruits-hero.webm`, com `bloxfruits-hero-v3.mp4` como alternativa e capa original.
- Logotipo StarBuxx, logotipo Blox Fruits, ícones Robux e Roblox e imagem PIX.
- Thumbnails de Blox Fruits, Steal a Brainrot e MM2; colagem de qualquer jogo.
- Fundos de Brainrot e MM2 e fundo da chamada final.
- Ícones de raça, Dragon, Kitsune e CDK no painel de contas.
- Artes de Blox Fruits: Dark Blade, Notificador de Frutas, 2x Dinheiro, 2x Maestria, +1 Espaço no Baú, Barcos Rápidos, Divine Portal Skin, Torment Pain, Dragon, Kitsune, Buddha, Magma, Gelo e Portal.
- Artes de Brainrot: VIP e 2x Dinheiro.
- Arte local de MM2: Chroma Luger.
- Fontes Inter e Plus Jakarta Sans locais, substituindo as chamadas ao Google Fonts.

Há 88 recursos de origem registrados, incluindo 43 SVGs de interface, dois arquivos de fonte e três arquivos de vídeo que representam duas cenas. Nem todo recurso exportado é usado: há artes adicionais de Brainrot preservadas no inventário. Nenhuma biblioteca JavaScript nem folha de estilos da aplicação original foi distribuída.

## Exceções

- **Saw, Hallowscythe e Waves:** a URL original está configurada, mas a exportação local falhou. Dependem do servidor original; se não carregarem, o projeto usa uma ilustração SVG alternativa e sinaliza isso no texto alternativo.
- **Base Dourada, Base Galáctica, Set Galáxia e Elite:** exemplos da primeira versão sem imagem correspondente identificada; mantêm ilustrações alternativas. Não foram associadas a fotos de outros produtos.
- **Catálogo completo:** não foi expandido para todas as ofertas do original. As imagens correspondem ao catálogo parcial já implementado e às seções visuais.
- **Vídeos:** foram identificados dois vídeos na loja principal. Nas categorias Brainrot/MM2 inspecionadas não havia elementos de vídeo. Não houve inventário de todas as rotas do domínio.
- **Marca e PIX:** continuam acompanhados da identificação de demonstração; não foram adicionados selos de certificação, endereço, contatos ou CNPJ como se o projeto fosse uma operação comercial real.

## Arquivos e execução

`dist/media-map.js` associa as mídias aos elementos; `dist/media.css` controla o posicionamento; `dist/media.js` controla a reprodução e os fallbacks. Para executar, use `node server.mjs` na pasta do projeto e abra http://127.0.0.1:4173/loja. O servidor foi atualizado com os tipos de mídia corretos e suporte a intervalos de bytes para vídeo.

## Reprodução e acessibilidade

Vídeos têm `muted`, `loop`, `playsinline`, capa e `preload="none"`. Carregam quando entram na tela, pausam quando saem ou quando a aba é ocultada e oferecem controle manual. A pausa manual persiste enquanto o elemento estiver montado. Com `prefers-reduced-motion`, a capa é mostrada. Se o navegador bloquear a reprodução, a capa e o botão para reproduzir permanecem disponíveis.

## Validação e publicação

Sintaxe e integridade dos arquivos verificadas. Testes em ambiente simulado passaram para renderização das rotas, filtros, carrinho, calculadora, animações, reprodução silenciosa, pausa manual, visibilidade da aba, movimento reduzido e fallback de imagem. Assinaturas WebM/MP4 foram verificadas. A conferência visual final desta revisão no navegador permanece pendente.

Esta revisão está nos arquivos locais e no ZIP atualizado. A prévia online ainda não recebeu as revisões de animações e mídias devido ao bloqueio de aprovação para acesso de rede.
