---
tags: [aula, metricas, funil, checkout, diagnostico, low-ticket]
fonte: https://www.youtube.com/watch?v=oVx6BxfAMmQ
canal: Germano Morandi (aula dada pelo Guilherme)
titulo_original: Aula 12 - Como Identificar o Gargalo da sua Oferta
duracao: 1:06:21
transcricao: raw/aulas/oVx6BxfAMmQ.txt
---
# Como identificar o gargalo na oferta

O professor considera esta "a aula mais útil": de nada adianta criar ou clonar uma boa oferta sem saber ler **por que** ela está dando prejuízo (ou insistir numa ruim porque deu ROI no primeiro dia).

## O funil em 5 etapas (padrão UTMify)
`Cliques → Visitas à página (connect rate) → Initiate checkout (IC) → Venda iniciada (gerou Pix/boleto/cartão) → Venda aprovada`

Cada passagem tem um dono diferente:

| Etapa | O que mede | O que mexe | Referência citada |
|---|---|---|---|
| Clique → visita | **Connect rate** (velocidade/hospedagem) | trocar host (**Vercel** é mais "noob friendly" que Firebase), imagens em WebP, código leve | 85–95% |
| Visita → IC | **Página de vendas / oferta** | headline, promessa, VSL, CTA (casar anúncio com página) | ≥25%; TSL/advertorial só de texto converte menos; com VSL passa de 30% |
| IC → venda iniciada | **Checkout** (página de pagamento) | campos, banner, prova social, order bump atrapalhando, diferença de preço, mobile | ≥75% |
| Venda iniciada → aprovada | **Gateway** (aprovação) | trocar gateway, recuperação de Pix por WhatsApp/e-mail | Pix ≥70% (cartão costuma ir bem) |
| Depois da compra | **Monetização (RPU / ticket médio)** | order bump, upsell (ver [Upsell e downsell](Upsell%20e%20downsell.md)) | — |

- **Conversão ≠ aprovação:** conversão é a pessoa entrar no checkout e gerar o pagamento; aprovação é o Pix ou cartão gerado ser pago. A conversão mostrada pelas plataformas (ex.: GG) costuma estar errada; confira gerados × pagos × expirados.

## Casos mostrados
- Oferta BR com prejuízo: o "culpado" não era página, criativo, headline nem preço, e sim a **aprovação do Pix em 50%** (gateway).
- Oferta que faturou ~R$ 165 mil: para chegar a 500 mil/mês com ROAS 1,74 seria preciso ~R$ 287 mil de tráfego. Escala "cara e frágil": primeiro arrumar o **vazamento depois do IC**.
- Portugal: muito boleto e MB WAY falhando; 47 entraram no checkout e só 19 foram aprovados.
- Oferta sem order bump vendido: a IA sugeriu **testar sem order bump por 3 dias**, porque se ninguém leva, ele só atrapalha a conversão. Também era preciso subir o RPU para ≥R$ 30–35.
- Oferta de receitas instável: sazonalidade ou fim do ciclo. Melhorar checkout e connect rate pode permitir escalar de 11k para 30–40k/mês aceitando ROAS menor (~1,6).

## Regras de decisão
- **Uma mudança por vez** (teste A/B), acompanhando 3–5 dias. Nunca mexer em checkout, página e oferta juntos.
- **Não julgar um dia com vendas pendentes.**
- **Não tentar compensar o vazamento aumentando o tráfego.**
- **Ordem prática:** connect rate (mais fácil) → checkout/gateway → página.
- **ROAS de break even:** desconte imposto, taxa da plataforma e do gateway até achar o ROAS que dá 0 a 0.
- **Quando descartar uma oferta:** prejuízo líquido de **R$ 500–600 no Brasil** e **R$ 2.500–3.500 em Portugal**.
- Mandar prints do **macro (30 dias) e do micro (7 dias / hoje)** para a IA, junto com o contexto da oferta. Dica: ao fechar a criação da oferta no Claude, pedir "salve em um .md" e anexar no GPT de tráfego.
- **Várias ofertas** de 10k cada são mais fáceis que uma de 100k.
- Ferramentas: UTMify (funil pronto), prompt que transforma prints do gerenciador da Meta num HTML de funil, GPT "analista de métricas" e checkouts/gateways testados (Cakto, Wap, GG, Mercado Pago).
- O professor mantém **segundos cérebros**: documenta cada acerto e erro de oferta e usa isso para educar a IA. É a mesma lógica deste segundo cérebro.

## Como aplicar
- Gestão de Obra: 530 visitas e **0 vendas**. Pelo funil, verificar primeiro connect rate e IC. Se houver IC sem venda, o problema é checkout ou rastreamento (ex.: o pixel não recebe as compras da Hotmart). O diagnóstico do Grok Bot já apontava isso → Diagnósticos Grok Bot.
- Arte (A História Cantada) (Hotmart, Europa): mesmo funil + aprovação de MB WAY/cartão.
- Painel vilas-mkt-dash: um bloco de **funil (cliques → visitas → IC → compra)** por conta de vendas seria uma melhoria natural.
- Consórcio Market (conversões pelo PostHog): o mesmo raciocínio vale para lead (cliques → visita → formulário → lead qualificado).

Relacionado: [Estrutura de tráfego](Estrutura%20de%20tr%C3%A1fego.md), [Estrutura de página para escalar](Estrutura%20de%20p%C3%A1gina%20para%20escalar.md), [10 dicas para low ticket](10%20dicas%20para%20low%20ticket.md), [Aulas](Aulas.md)
