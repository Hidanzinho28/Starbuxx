# Inventário de animações — revisão de 03/11/2026

Inspeção adicional de `https://star-buxx.com/loja`: estados visuais, classes e estilos calculados, área de economia em movimento e abertura do carrinho. A implementação é própria; nenhuma biblioteca ou código proprietário foi extraído.

| Área | Movimento implementado |
| --- | --- |
| Hero | Entrada progressiva do breadcrumb, título, descrição e busca; fundo acomoda o zoom inicial. |
| Navegação | Escala de hover, pressão no clique e sublinhado dourado animado. |
| Marca alternativa | Rotação leve e aumento do brilho no hover. |
| Busca | Transição de borda, fundo e halo dourado ao receber foco. |
| Jogos | Entrada em sequência curta, elevação de 4–5 px, imagem com zoom de 1,05 em 500 ms, borda e sombra douradas em 300 ms, seta que avança. |
| Contas | Painel principal entra de −20 px e painel secundário de +20 px; borda e zoom de arte no hover. |
| Economia | Entrada em escala 0,88; barras descendentes oscilam em sequência; linha é desenhada; marca alternativa flutua e tem órbita giratória; cinco símbolos flutuam com fases diferentes; descontos aparecem e desaparecem. |
| Texto e calculadora | Entrada vertical, controles com resposta ao toque, mudança de preço com fade e deslocamento curto. |
| Perguntas frequentes | Expansão/retração em 240 ms, giro do indicador e transição de borda/fundo; interrupção e reversão ao clicar rapidamente. |
| Guia | Título entra com blur de 6 px e deslocamento de 24 px; artigos aparecem ao rolar e índice destaca a leitura. |
| Chamada final | Título, descrição e botão aparecem ao entrar na tela; degradê dourado se move em 6 s; símbolos alternativos flutuam com halos pulsantes. |
| Catálogos | Faixa contínua de categorias em movimento; entrada de produtos; zoom de imagem; filtros e buscas revelam os novos resultados. A faixa não apresenta vendas fictícias como reais. |
| Carrinho | Painel desliza da direita em 500 ms e sai em 300 ms, como observado no original. Atualizações internas usam fade curto; contador recebe pulso ao adicionar. |
| Outros modais | Entrada com fade, escala e deslocamento; saída animada; backdrop entra e sai gradualmente. |
| Menu móvel | Entrada com fade, deslocamento e escala. |
| Botões e avisos | Feedback de pressão, brilho/sombra de hover; toast entra e sai suavemente. |
| Âncoras | Rolagem suave e destaque no índice do guia. |

## Acessibilidade e desempenho

- `prefers-reduced-motion` desliga entradas, ciclos, scroll suave e transições. O conteúdo permanece visível, o gráfico é apresentado completo e a faixa passa a ser rolável manualmente.
- A faixa tem botão de pausa/retomada e pausa ao passar o mouse ou receber foco.
- Ciclos de economia, faixa e chamada final param fora da área visível.
- Observadores e animações são limpos nas trocas de página; animações interrompidas não deixam elementos transparentes.
- Prioridade para `transform` e `opacity`. A exceção é a altura do acordeão, necessária para a expansão contínua sem salto.
- Não há dependência adicional de biblioteca de animação.

## Limites de equivalência

Este inventário cobre os efeitos identificados nas áreas públicas inspecionadas. Não é uma garantia de todos os estados privados, todas as rotas ou temporizações exatas de cada efeito. Os ciclos do gráfico e dos símbolos foram reconstruídos a partir da observação; os tempos não expostos no DOM foram aproximados. Na revisão de mídias, o usuário confirmou autorização e imagens, marca e vídeos originais disponíveis foram incorporados; consulte `MIDIAS.md` para exceções.

## Arquivos

`dist/motion.css` contém efeitos e keyframes. `dist/motion.js` controla entradas por visibilidade, ciclos, modais, carrinho e acordeão. `dist/app.js` aciona os efeitos nas mudanças de estado.

## Validação

Sintaxe de `app.js` e `motion.js` verificada com Node. Os testes de renderização de 11 rotas, filtros, carrinho e calculadora continuam passando. Há verificações específicas do ciclo dos observadores, diálogos e movimento reduzido. A conferência visual desta revisão no navegador e a atualização da hospedagem ficaram bloqueadas pelas restrições de acesso de rede do ambiente.

Contas e Gift Cards: entrada automática por visibilidade com sequência de 65ms (máximo 195ms), títulos e barra de filtros, reflexo na arte ao passar o mouse, resposta dos botões, painel de filtros deslizando em 280ms e resultados atualizados em 260ms. Sem controles de pausa; respeita movimento reduzido. Detalhes e carrinho usam as transições compartilhadas.
