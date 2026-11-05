# Redução global de preços

Preços de venda reduzidos em 30%, com arredondamento em centavos, em todo o catálogo: MM2, Blox Fruits, Brainrot, contas, Gift Cards e pacotes Robux. A regra é centralizada em dist/pricing.js. Os arquivos de catálogo mantêm os preços-base para edição; a redução é aplicada uma única vez ao carregar.

Cartões mantêm o saldo facial; referências de preço do Roblox e preços antigos riscados permanecem como comparação. Calculadora, detalhes, destaques, economias e carrinho usam o novo preço. Carrinhos existentes são recalculados pelos identificadores salvos.

Exemplos: Dark Blade R$ 47,45 → R$ 33,22; conta de R$ 7,49 → R$ 5,24; Gift Card de R$ 25 vendido por R$ 19,99 → R$ 13,99; 1.000 Robux R$ 36,50 → R$ 25,55. Testados todos os produtos e os pacotes de 270 a 22.500 Robux. Conferido no navegador o pacote de 1.000 Robux e o mesmo total no carrinho.

Pacotes Robux e Gift Cards personalizados agora têm cobrança mínima de R$ 15,90. Quantidades cujo cálculo fique abaixo disso usam esse piso. A regra compartilhada alcança calculadora, cartão personalizado, compra e carrinho. Os outros itens não receberam piso de preço.

Correção do mínimo: removido o piso artificial de cobrança. O preço volta a ser exatamente o preço-base menos 30%, arredondado em centavos. Quantidade mínima calculada de 587 Robux resulta em R$ 15,00; 586 resulta em valor menor e deixa de ser selecionável. Calculadora, barra, atalhos e Gift Card personalizado usam o mesmo mínimo.
