---
tags: [aula, aula-detalhada, metricas, gargalo, funil, checkout, gateway, connect-rate, diagnostico, low-ticket]
atualizado: 2026-11-26
fonte: https://www.youtube.com/watch?v=oVx6BxfAMmQ
transcricao: raw/aulas/oVx6BxfAMmQ.txt
professor: Guilherme (mentoria "Escale", canal Germano Morandi) — Aula 12, ~66 min, análise ao vivo de ofertas dos alunos
nota_resumo: "[Como identificar gargalo na oferta](../Como%20identificar%20gargalo%20na%20oferta.md)"
---
# Detalhe — Como identificar o gargalo da oferta (análise de métricas) — Aula 12

Versão aprofundada feita pelo Grok Bot (26/11/2026) a partir da transcrição completa. Resumo rápido do Claude Code: [Como identificar gargalo na oferta](../Como%20identificar%20gargalo%20na%20oferta.md). Índice: [Aulas - Índice e Playbook](../Aulas%20-%20%C3%8Dndice%20e%20Playbook.md). **É a aula mais útil para as análises diárias do Grok Bot** (Grok Bot - rotinas de análise, Diagnósticos Grok Bot).

## Tese da aula
"Não importa criar uma oferta muito boa, subir, tomar prejuízo e **não saber ler as métricas** para entender por que tomou prejuízo" — nem clonar uma oferta que deu ROI no primeiro dia e insistir nela para sempre. Ler métricas = saber como a oferta está **de verdade** e **qual é o gargalo** (e atacar **um por vez**).

## O funil de 5 etapas (como ele lê no UTMify/Tracker)
Cliques → **Visitas à página** (landing page views) → **Initiate Checkout (IC)** → **Vendas iniciadas** (pagamento iniciado/gerado) → **Vendas aprovadas**.
| Passagem | O que mede | Gargalo = | Referência dada |
|---|---|---|---|
| Clique → visita | **Connect rate** (velocidade/hospedagem/tracking) | página lenta, hospedagem ruim | **meta 90%+** (95% ideal); 85% "ok, pouco a melhorar"; "apenas OK" aprox. 80%; "20% dos cliques nem viram visita" é problema |
| Visita → IC | **Página de vendas** (copy, headline, VSL, promessa × anúncio) | oferta/página fraca | **pelo menos 25%** (com VSL tende a passar de 30%; página só de texto/TSL/advertorial ~20%; 28–30% considerado bom; 14–18% = "mediana") |
| IC → pagamento iniciado (venda iniciada) | **Checkout** (atrito, campos, order bump, método de pagamento, lentidão no mobile) | checkout ruim | **acima de 75%** |
| Venda iniciada → aprovada | **Gateway / aprovação** (Pix, cartão, boleto) | gateway com taxa baixa | **Pix acima de 70%** (abaixo disso é o primeiro problema); cartão/boleto idem na plataforma |
| Aprovada → receita por comprador | **Monetização/ticket médio** (order bump, upsell) | comprador deixa pouco dinheiro vs. custo de aquisição | RPU precisa cobrir o CPA/break even |
- Distinção importante: **checkout** é a página de pagamento (conversão); **gateway** é o que **aprova** o Pix/cartão (aprovação). Muita gente confunde e olha o número errado (um aluno viu "80% de conversão" no site da plataforma que não representava a aprovação real).
- **Regra de ataque (fundo para o topo, o mais perto do dinheiro primeiro):** (1) aprovação de pagamento/gateway, (2) checkout, (3) página de vendas, (4) connect rate (é o mais fácil de resolver, mas raramente onde mais se perde). A ordem pode variar; o importante é **uma mudança por vez** e **não mexer em checkout e página juntos** (não dá para fazer teste A/B/C). Não considerar o dia corrente enquanto há **vendas pendentes**; não tentar compensar um vazamento aumentando tráfego.

## Exemplos reais da aula (diagnóstico → ação)
1. **Oferta no prejuízo no Brasil — causa: gateway.** Houve R$ 283 pendentes, faturamento bruto ~R$ 550 (líquido R$ 359); **aprovação do Pix ~50%** (gateway de Pix "horrível", de cartão boa). Ninguém dos alunos acertou (chutaram página, criativo, headline, velocidade, preço, promessa). Ação: trocar o gateway de Pix, recuperação de Pix por WhatsApp/e-mail, mudar só isso e acompanhar 3–5 dias. O GPT dele deu o mesmo diagnóstico.
2. **Oferta com R$ 165.000 (soma de 8 campanhas em ~3 anos) querendo escalar para R$ 500 mil/mês:** o GPT calculou que, mantendo a economia atual (ROAS 1,74), seriam ~3.432 compras e ~R$ 287 mil de tráfego/mês — "escala cara e frágil"; gargalo principal depois do IC. O professor: com ticket maior, o CPC barato e público qualificado "curioso" faz sentido ter menos IC por visita; para low ticket de R$ 10 a leitura seria outra. Também: ele prefere ter **10 ofertas de R$ 10 mil/mês** do que uma de R$ 100 mil ("mais fácil"); amigos que fizeram 5 milhões preferem várias ofertas.
3. **Oferta em Portugal (Tracker):** vende, mas "não pronta para escala agressiva": de 221 que iniciaram pagamento, 65 não aprovados; checkout perde 44,5% dos que iniciaram o IC; 20% dos cliques sem visita registrada; configuração incompleta (custos/taxas/impostos zerados) superestima o lucro. Se a aprovação sair de 70% para 80% → ~21 vendas a mais no período. Observação: em Portugal há boleto/MB Way; MB Way às vezes falha; deixar boleto ativo; mercado de PT = cartão, MB Way, boleto (Pix não existe).
4. **Aluno Henrique (Portugal, ROI 4 no 1º dia):** connect rate fraco (hospedagem Firebase) → testar **Vercel** primeiro ("mais noob-friendly"; às vezes o contrário funciona, depende da região/oferta). Página só de texto (TSL/advertorial, IC/visita fraco) → colocar **VSL** deve levar IC/visita a 30%+. 43% (30 dias) de quem iniciou checkout inicia pagamento; 14–18% das visitas iniciam checkout. Plano do GPT: hoje não mexa; amanhã às 7h confira aprovações por Pix/cartão/boleto; se Pix < 70% ataque isso; se OK, ataque só o checkout por 5 dias, **uma alteração por vez**; depois que vendas iniciadas > 75%, ataque a página (visita→IC ≥ 25%); por último o técnico (cliques → visitas).
5. **Aluna Letícia (Brasil, receitas, ROI estável mas instável por dia):** connect rate 85% (OK), página com 30% visita→IC (copy ótima, sem VSL), **checkout é o gargalo**: 1.848 IC, 736 Pix pagos, 151 expirados; gateway Mercado Pago (CNPJ), plataforma "GG". Ação: testar outras plataformas de checkout/gateway (mencionou Cacto e Wap/ "IAP"), melhorar conversão do checkout; melhorando o connect rate para 90–95% ganha ~4% de faturamento (ex.: +R$ 500 num mês de ~R$ 11–12 mil; +R$ 4.000 se fosse R$ 100 mil/mês). Potencial: de ~R$ 11 mil/mês para 30–40 mil, aceitando ROAS menor (~1,6).
6. **Aluno com prejuízo de ~R$ 700 no Brasil:** página boa e gateway boa, **checkout ruim + ticket baixo**: 247 IC, 82 iniciaram pagamento; 28% das visitas vão ao checkout; aprovação 70,7% agregada mas Pix deve estar > 70% na plataforma; recuperação de pagamento por WhatsApp ausente; **RPU precisa chegar a ≥ R$ 30 só para pagar a mídia** (≥ R$ 35 nos últimos 7 dias) → aumentar ticket médio (order bump/upsell). Ação: mexer **só no checkout**; testar rodar **sem order bump por 3 dias** (se os bumps não saem, podem estar atrapalhando); não mudar criativo/LP/preço junto; não aumentar orçamento. O professor acha que "dava para ter ressuscitado antes", com prejuízo de R$ 300 o veredito seria o mesmo.

## Quando descartar uma oferta
- **Brasil: ~R$ 500–600 de prejuízo líquido** (conta o que voltou: "colocou 200, voltou 100 = 100 de prejuízo") sabendo ler o funil → descarta.
- **Portugal: variável, ~R$ 2.500–3.500**.
- Observação dele: casos em que a oferta "vende desligada" ou vende sem estar rodando acontecem e ele "não sabe explicar".

## Como calcular e ler
- **ROAS break even** = ROAS que dá ROI 1,0 depois de impostos, taxa da plataforma de vendas, taxa do gateway e demais taxas; sem isso não dá para saber se "ROAS 1,74" é bom. 
- Sempre mandar à IA contexto da oferta (país, plataforma, gateway, produto, métodos de pagamento, ticket), prints de **macro (30 dias) e micro (hoje + 7 dias)**, e olhar **vendas pendentes** antes de julgar o dia.
- Colunas úteis no Meta (para quem não usa UTMify): personalizar colunas — veiculação, orçamento, estratégia de lance, custo por resultado, resultados, valor dos resultados, ROAS, valor usado, alcance, CPC, cliques no link, finalizações de compra iniciadas, CPM, CTR único, frequência, hook/hold, **visualizações da página de destino** (essencial para connect rate), adições ao carrinho (se houver tracking avançado). Sem as vendas iniciadas (Hotmart não manda) a análise pelo Meta fica pior que pelo UTMify.
- O professor criou: (a) um **HTML com prompt** que transforma prints do gerenciador num "funil estilo UTMify"; (b) um **GPT "gestor de tráfego/analista oficial de métricas"** treinado com o segundo cérebro dele (acertos e erros documentados), que dá o diagnóstico como ele daria (resultados variam a cada pergunta; funciona sem plano pago); (c) dica: ao criar a oferta no Claude, ao fim pedir "salve em um .md para o gestor de tráfego analisar a operação" e arrastar o arquivo para o GPT.

## Como aplicar nas contas do Arthur
- **Gestão de Obra (vendas baixas)**: o painel do Arthur **não mostra** IC/vendas iniciadas/aprovação; para o diagnóstico completo, pedir prints do UTMify/Hotmart (macro e micro) e seguir a ordem gateway → checkout → página → connect rate. Já apontado em Diagnósticos Grok Bot (criativo cansado/público saturado): conferir também connect rate (< 90%) e visita→IC (< 25%).
- **Infoprodutos com Hotmart** (A História Cantada, Pilates 50+ em Portugal, Time Direct Response): checkout em Portugal com **cartão, MB Way e boleto**; monitorar aprovação por método; agente **Funil** deve checar aprovação antes de culpar a copy.
- **Rotinas 7h/12h/18h**: ao reportar queda de resultado em conta de venda, lembrar que a causa pode estar **depois do clique** (connect, checkout, aprovação), não só no criativo — pedir os dados macro+micro e as vendas pendentes antes de concluir.

#aulas #metricas #gargalo #funil #checkout #gateway
