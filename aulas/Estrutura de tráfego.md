---
tags: [aula, trafego, meta-ads, bidcap, andromeda]
fonte: https://www.youtube.com/watch?v=TzF5zEa3yTA
canal: Germano Morandi (aula dada pelo Guilherme)
titulo_original: Aula 01 - Utilize essa estrutura de tráfego para escalar
duracao: 46:50
transcricao: raw/aulas/TzF5zEa3yTA.txt
---
# Estrutura de tráfego (CBO + Bid Cap)

Metodologia creditada ao Allanzord (ver [Aula de BidCap](Aula%20de%20BidCap.md)). Feita para o Meta pós-**Andromeda**, que recompensa **estabilidade**: uma campanha só, orçamento alto e criativos entrando nela. Duplicar campanhas ("escala baiana") não funciona mais, e o ABO está sendo descontinuado.

## Por que Bid Cap
- Funciona como **stop loss por leilão**: o Meta só compra dentro do teto que você define. Bom para quem tem pouco caixa.
- Quem entra melhor no leilão domina, mesmo contra concorrentes mais antigos.
- Exige pouco tempo: o professor olha cada oferta **uma vez por dia**.

## Pré-requisitos (ajudam, mas não são obrigatórios)
- **Break even calculado:** ticket médio menos imposto do Meta, CNPJ e taxas. Peça para a IA calcular.
- Criativo já validado.
- Pixel e rastreamento avançado. O pixel faz diferença; com 200+ vendas performa muito mais.
- Sem nada disso: começar buscando **volume** (mais vendas, mesmo que menores) até ~20–30 compras, para o pixel aprender.

## Estrutura
- **1 campanha CBO com limite de lance (Bid Cap), sozinha na conta.** Nada de ABO ou CBO paralelas, senão a inteligência se divide.
- **Conjuntos por ângulo** (~5 criativos cada). Ex.: oferta de doces → "ganhar dinheiro vendendo doce" num conjunto, "doce saudável para quem está acima do peso" em outro.
- **Público Advantage+ aberto:** sem interesses, posicionamentos automáticos, idade e gênero abertos na dúvida. **A segmentação fica no criativo** ("para você que está acima do peso...").

## Criativos
- **Diversidade vale mais que variação:** 5 criativos totalmente diferentes são melhores que 20 versões do mesmo (camiseta de outra cor não adianta mais).
- Variação útil: o mesmo **hook** com outro **body**.
- **Não subir com poucos criativos:** 3 bons sozinhos não gastam. Coloque os 3 bons + ~10 medianos.
- **Imagem fora do Bid Cap:** o CTR alto da imagem faz o Bid Cap torrar verba nela, e vídeo converte mais (dito na gravação de 4 de junho; pode mudar).
- **Cadência:** no mínimo **1 lote (5+ criativos num conjunto novo) por semana**. O professor sobe toda **segunda à 00:01**. **15 dias sem criativo novo fizeram o ROI despencar.**

## Valor do Bid Cap
- Para validar e agressivar: **30% acima do break even**. Pós-Andromeda, se não gasta, suba até **+50%** (ex.: ticket de 100 → lance de 150).
- Conjunto validado que parou de gastar: subir o lance (ex.: 100 → 120/130).
- O CPA real costuma sair bem abaixo do lance, porque o lance é só o teto do leilão.
- **Se a campanha não gasta, não vai performar.** Mas um conjunto antigo bom sem gastar *hoje* é sinal de que o Meta está priorizando o que vende.

## Métricas, por ordem de importância
1. **Vendas, ROAS, custo por resultado** e valor dos resultados (mostra order bump e upsell).
2. **Initiate checkout (IC):** a média de IC por venda depende da oferta. Ofertas que atraem curiosos têm ~4,5 IC/venda, e isso não é necessariamente ruim.
3. CPC (terciário).
4. **Hook rate** (3 segundos) e **hold rate** (25%): servem para criar criativos novos, não para decidir ROI.
5. **CPM:** referência ~R$ 50 no Brasil (cai para ~29 com muitas vendas), US$ 200–300 nos EUA.
- **Sempre cruzar macro (máximo/30 dias) com micro (hoje/7 dias)** antes de pausar, e mandar os dois para a IA.

## Quando pausar e como escalar
- **Pausar** um criativo quando gastar **3× o Bid Cap** sem venda ou abaixo do break even (com pouco caixa, 2×).
- **Escalar subindo o Bid Cap, não o orçamento diário** (com orçamento de 6.000, gastar 600 mostra que o orçamento não é o limite). Ideal: gastar perto do orçamento.
- **Detalhamento por idade a cada 14 dias** (botão "Detalhamento" ao lado de Colunas): cortar faixas sem venda. Aceite ROAS menor na faixa que dá volume.
- Coluna **"Estratégia de lance"** visível, para ver o lance de cada conjunto.
- **Testar Bid Cap com ABO já rodando:** subir em **outra conta de anúncio** com o **mesmo pixel** e o mesmo checkout, e dar ~7 dias.

## Erros que matam
Duplicar campanha, ter mais de uma campanha na conta, pensar em "fatias de público", usar interesses, escalar pelo orçamento diário, pausar antes de 3× o Bid Cap e ler métricas errado (a IA também confunde CPA com valor de resultado; corrija).

## Como aplicar
- **Low ticket / infoproduto** (Gestão de Obra, Arte (A História Cantada), Time Direct Response): esta é a estrutura-padrão.
- **Clientes de serviço** (advocacia, clínicas): o ponto é diferente, porque o objetivo é mensagem, não compra com valor. Mas valem os princípios: poucas campanhas, segmentação no criativo e cadência semanal de criativos. O diagnóstico do Curvo (12 campanhas fragmentadas em ~R$ 90/dia) contraria isso → Diagnósticos Grok Bot.
- Painel vilas-mkt-dash: a coluna "Estratégia de lance" e o detalhamento por idade são lacunas que já foram apontadas.

Relacionado: [Aula de BidCap](Aula%20de%20BidCap.md), [Aula de criativos](Aula%20de%20criativos.md), [Como identificar gargalo na oferta](Como%20identificar%20gargalo%20na%20oferta.md), [Aulas](Aulas.md)
