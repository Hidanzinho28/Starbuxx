# Aba Robux — revisão de 03/11/2026

A rota `/robux` foi refeita a partir da inspeção da página pública https://star-buxx.com/robux. A calculadora isolada foi substituída por uma página com visual de moeda, configuração de pacote e conteúdo de apoio.

## Implementado

- Moeda dourada com volume, rotação, pausa manual, pausa fora da tela/aba e movimento reduzido.
- Quantidade editável, botões de diminuir/aumentar e barra de 270 a 22.500 Robux.
- Atalhos: 400, 800, 1.700, 4.500, 10.000 e 22.500.
- Resumo do total, referência e economia atualizados em conjunto.
- Preenchimento inicial pela URL `?qty=1700`.
- Adição do pacote ao carrinho existente, soma de pacotes iguais, alteração de unidades, remoção e persistência no navegador.
- Etapa de continuação com Via Gamepass e perfil Roblox selecionado. Via Plus permanece indisponível.
- Perguntas expansíveis, guia por âncoras e vitrine horizontal de produtos com imagens locais já autorizadas.
- Entradas animadas e resposta visual nos controles e nos valores.

## Diferenças e limites

- A moeda agora é uma malha 3D real desenhada em WebGL: frente, verso, espessura, chanfros, sulco e abertura central. A geometria é procedural e os shaders dão iluminação dourada com reflexos. Nenhum modelo proprietário foi extraído; geometria e material são uma aproximação do original. Se WebGL não estiver disponível, permanecem as camadas SVG como fallback.
- O ícone branco dos atalhos foi exportado do site original, conforme autorização já confirmada pelo usuário.
- O preço-base e a referência observados no pacote de 1.000 foram usados como parâmetros fixos: R$ 36,50 e R$ 62,50. Não há consulta de preço ao vivo, ranking, estoque ou descontos por volume.
- O título e os selos foram adaptados para não apresentar estatísticas de vendas, ranking ou garantias do original como dados desta recriação.
- As avaliações apontam para a página original; os relatos e as notas dos clientes não foram reapresentados como avaliações desta loja.
- O checkout continua demonstrativo: não gera PIX, cobrança, entrega ou pedido real. A seleção do perfil público não é autenticação Roblox.
- A vitrine contém seis produtos do catálogo já implementado, não todas as ofertas do site original.

## Validação

Testes automatizados: limites, arredondamento, parâmetros de URL, atalhos, estrutura dos controles, carrinho com pacotes e preservação das rotas existentes.

Teste no navegador: 1.700 Robux por R$ 62,05; duas unidades no carrinho por R$ 124,10; remoção do item de teste; barra no máximo de 22.500 por R$ 821,25; modal com indicação de método e seleção de conta. O console não apresentou erros. O layout móvel foi conferido sem rolagem horizontal.

## Arquivos

`dist/robux-page.js`, `dist/robux-page.css` e `dist/assets/robux-coin-face.svg`. O carrinho compartilhado foi atualizado em `dist/app.js`; as entradas por visibilidade foram estendidas em `dist/motion.js`.

`dist/robux-3d.js` contém a malha, iluminação, câmera e interação. Arraste a moeda para girar; as setas do teclado também ajustam o ângulo quando o modelo está focado. O botão pausa a rotação automática. Movimento reduzido, aba oculta e saída da área visível suspendem o movimento; os recursos gráficos são liberados ao sair da página.

O canvas WebGL foi confirmado na prévia, sem erros no console. Os testes da malha conferiram triangulação, normais unitárias, abertura central e superfícies de frente/verso/laterais.

Atualize com Ctrl+F5 no servidor já aberto. Não é necessário reiniciá-lo para esta alteração.

Refinamento: contorno hexagonal arredondado, aro interno elevado, espessura menor e reflexos procedurais de estúdio. O modelo é uma reconstrução independente; não utiliza o modelo 3D ou HDR original.

Métodos atualizados: Via Gift Card abre a escolha de cartões; Roblox Plus permite selecionar a quantidade e montar o pacote local. Seletor da loja e página Robux alinhados. Carrinho identifica Roblox Plus e preserva pacotes Gamepass antigos. Não há cobrança ou entrega real.

Gift Card personalizado: o seletor de /robux e a calculadora de /loja criam uma prévia com a quantidade e o preço selecionados. O carrinho usa método giftcard e identificador distinto de Plus, preservando quantidade e total na compra. Testado 1.700 Robux por R$ 43,44 na arte, carrinho e checkout. Não é emitido código oficial de resgate.
