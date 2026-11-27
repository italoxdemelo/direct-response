---
tags: [aula, aula-detalhada, trafego, bid-cap, cost-cap, cbo, escala, meta-ads, convidado]
atualizado: 2026-11-26
fonte: https://www.youtube.com/watch?v=jsgD2SUatf4
transcricao: raw/aulas/jsgD2SUatf4.txt
professor: Allanzord (convidado do Germano Morandi/Guilherme, mentoria "Escale") — "Entenda tudo sobre BidCap", ~77 min, com perguntas ao vivo
nota_resumo: "[Aula de BidCap](../Aula%20de%20BidCap.md)"
---
# Detalhe — Bid Cap com o Allanzord

Versão aprofundada feita pelo Grok Bot (26/11/2026) a partir da transcrição completa. Resumo rápido do Claude Code: [Aula de BidCap](../Aula%20de%20BidCap.md). Índice: [Aulas - Índice e Playbook](../Aulas%20-%20%C3%8Dndice%20e%20Playbook.md). Complementar: [Detalhe - Estrutura de tráfego CBO + Bid Cap (Guilherme)](Detalhe%20-%20Estrutura%20de%20tr%C3%A1fego%20CBO%20%2B%20Bid%20Cap%20%28Guilherme%29.md) (aqui há divergências, ver seção final).

O convidado é a referência que trouxe o Bid Cap para o Brasil (no mercado desde 2019; já escalou **R$ 300–350 mil/dia**; roda principalmente como afiliado na gringa). Ele diz que **não existe estrutura de tráfego perfeita do momento**: importa mais **como você compra mídia e lê as métricas** e o que funciona para sua equipe; aceita variações. A aula é "o básico linear" e depois dúvidas.

## Conceitos
| Tipo | O que diz ao Meta | Comportamento |
|---|---|---|
| **CBO normal / alto volume (HV)** | "tenho R$ X por dia, me entregue o máximo de conversões" | o Meta "se vira": atua em leilões caros e baratos; **day trade** (dia muito bom, depois dias péssimos); gasta ~100% (às vezes 70% do orçamento numa manhã); dia ruim derruba para ROAS ~0,5 |
| **Bid Cap** (limite de lance) | "orçamento R$ X, mas **só dou lance até R$ Y no leilão**" | limite **no leilão** (impressões, não cliques); **o mais estável e mais certeiro**; escala menos mas mostra o **limite real da escala**; dia ruim no Bid Cap costuma ficar em ROAS 0,7–0,9 (não pausar: recupera) |
| **Cost Cap / "Meta por resultado" (custo por resultado)** | limite no **custo por compra/lead** | meio-termo: mais estável que o CBO normal, **mais agressivo e menos preciso que o Bid Cap**, estoura CPA mais fácil; "o termo gringo é Meta por resultado"; fica no mesmo lugar da configuração (custo por resultado) |
- **Cálculo do lance:** Bid Cap ≈ **ticket do front × 1,3 ou 1,5** (para forçar o gasto); Cost Cap ≈ **ticket × 0,7** (ou custo por resultado para baixo, porque estoura fácil). **Não usa Bid Cap e Cost Cap ao mesmo tempo.**
- **Por que o Bid Cap "não gasta":** leilão = impressão; se não imprime, não gasta. Causas: conta/pixel/oferta novos (chance menor ainda), mas **~70% das vezes são criativos e oferta que não entregam conversão**. Nota: com a eleição o leilão estava mais caro/competitivo, então ele usa **×1,5** e **prioriza subir o lance** (não descer) para ganhar competitividade.
- **Vantagem do Bid Cap em escala:** antes, escalar era subir 1k → 1,5k → 2k → 4k e, num dia de salto (ex.: 8k), perder o lucro de vários dias; o Bid Cap mostra o limite: "se subir o lance, estoura o CPA; se baixar, perde escala".

## Crenças operacionais dele (para decidir rápido)
1. **Fatias de público = criativo e funil**, não configuração no gerenciador. Só testa público novo ao **escalar** (R$ 20–50 mil/dia). Público aberto; só **idade e sexo** quando necessário; produto dele roda "tudo aberto", sem marketing/remarketing/lista de comprador, 1 campanha, ~1,5 ano com ROI diário.
2. **Não duplica**: aceita só **uma redundância** do mesmo criativo (um em Bid Cap + um em outra estrutura); nunca mais que 2 versões.
3. **Sem mudanças agressivas intraday** (orçamento/lance do dia): movimentos são para o **dia seguinte**.
4. **Se o Bid Cap não gasta: ou os anúncios ou a oferta são ruins** — não fica tentando forçar. **Só admite que não é o anúncio depois de subir 100–150 ads** (assertividade de anúncios no mercado ~2%, "conta de padaria": deveria acertar 2–3). Se subiu 50–70 ads e já começa a gastar, existe potencial. Dá ~1–2 semanas para subir os 100. Se não gastar → **descartar/adaptar a oferta**. Hoje, com IA/Claude, 100–150 ads "faz em uma semana".
5. **Testar de graça**: antes do Bid Cap, testar 10 criativos custava ~R$ 1.000; agora, se não gasta, economizou. Em dúvida, isole o anúncio no CBO e veja (ele já fez; vender 1 aqui e 1 ali não escala).
6. **Menos complexidade**: **1–2 contas no máximo**; até ~R$ 5–10 mil/dia uma conta basta (ex.: oferta com R$ 5–7 mil de lucro/dia em uma conta e 2 campanhas); até ~R$ 100 mil/dia duas contas; uma 3ª só em escala absurda. Tem contingência (perfis e BMs antigos, páginas compradas) e acredita que "contas nascem neutras" e ficam fortes/fracas por anúncio rejeitado, erro de pagamento e ativos caindo (1–3 contas caídas ainda ok; mais que isso suja os ativos).
7. **Volume de anúncios**: o Bid Cap precisa de volume; pode começar com 10–15 e subir mais ~10 a cada 2–3 dias. **Respeitar o Meta**: não colocar travas.
8. **Contas novas:** jogar gasto em 2–3 contas e focar na melhor.

## Estrutura básica (a que ele usa)
- **1 campanha Bid Cap (CBO) com conjuntos; todo pacote novo de anúncios vai em conjunto novo** (3–5 ads por conjunto como receita, mas "já subi com 1, 3, 5, 10, 15; é mais sobre volume"). Exemplo: campanha com ~11 ads; chegaram 4 novos do editor → duplica o conjunto e coloca os novos. Objetivos: **testar de graça, escalar com estabilidade, controle de gasto por performance, decisões rápidas**.
- Os **top spenders puxam o resultado**; os novos são testados de graça. Se um novo for bom, toma o lugar do top spender. "Na dúvida, isole."
- **Alternativa:** subir os ads novos em **campanha nova** (também Bid Cap): gasta um pouco mais, funciona; problema só se houver CBO normal escalando junto (ele "invalida" o Bid Cap). Usa as duas formas conforme a estratégia.
- **Orçamento inicial**: **2–3× o ticket do front** (até ~30 ads); ~**6×** se ~60 ads.
- **Escala vertical:** 1 vez ao dia **+20–50% dependendo da margem** (ROAS 2,5 → pode subir 50% de uma vez; ROAS apertado → pouco). **Mantém o Bid Cap** e escala no orçamento (não descer o lance). Exemplos: já dobrou US$ 3.000 → US$ 6.000 sem problema e já triplicou em uma campanha/conta; "escalar = ficar exposto a dias bons e ruins; a habilidade é controlar".
- **Lateralizar** só com muita escala (10–20 mil/dia): abre a 2ª conta e coloca ali o "**1-1-1**" com os ads vencedores. **No 1-1-1 da outra conta ele joga SEM Bid Cap (CBO normal)**, para atuar com Bid Cap e sem Bid Cap no leilão inteiro (Bid Cap limita uma fatia do leilão; CBO normal pega o leilão todo; é o único jeito de buscar fatias novas no gerenciador).
- **Orçamento inflado:** só para oferta muito saudável, validada, com muito caixa (R$ 50–100 mil para gastar 10–20 mil) e quando se aceita ignorar números ruins de conjuntos isolados (ex.: perder R$ 2 mil em um dia, mas lucrar 5–10 mil todo dia). Não recomenda para iniciante.
- **Uma oferta por conta de anúncio** (não misturar ofertas). **Loja/e-commerce:** uma campanha por front/slug, com bastante criativo; 3–5 slugs por conta, mais que isso separar.

## Perguntas respondidas
- **Anúncio com gasto alto e ROAS < 1 (top spender negativo) enquanto outros com ROAS bom gastam pouco, e o conjunto fica no zero a zero:** não microajustar. Exemplo ilustrado: ads que gastam mais puxam a campanha para baixo e os que gastam pouco têm ROAS maior. Os que gastam pouco **não aguentam escala** (nível de consciência/copy/fatia); se tentar escalar um ad que gastou pouco, toma prejuízo. Muitas vezes pausar o top spender "mata a campanha". Ele **não pausa ad só pelo resultado dele**: analisa histórico, "feeling", tempo de oferta e de anúncio; só pausaria se estiver uma semana em prejuízo muito absurdo. **Conjuntos novos que não gastam: manter ali** (podem gastar depois/virar contingência).
- **Gastar (mesmo sem vender) é bom sinal:** "tem que ficar feliz se gastar"; em nicho novo sem repertório de criativos, é comum não gastar.
- **Aquecer o pixel antes:** vale rodar **CBO normal** para dar dado ao pixel e depois migrar; depende do ticket: com ticket alto (ele cita nutra de R$ 1.000), não dá para esperar 50 vendas; com **low ticket**, dá para esperar ~**100 vendas**; com 50 vendas já ajuda. Ao migrar, pode trocar a campanha na mesma conta. Se ficou uma semana com ROAS ~0,9 há o que ajustar; se ROAS 0,2 e gastou R$ 1.000 com 1–2 vendas, "não tem como salvar" e no Bid Cap não gastaria nada.
- **Serve para tudo:** e-commerce, lançamento, captação de lead (campanha de lead dele com **R$ 1.000/dia, ~R$ 50 mil no mês passado, 100% Bid Cap**), venda high ticket, serviços. **Para lead use o custo por lead como base do lance** (não o valor do serviço). Para ticket de serviço muito variável, use o **ticket médio × 1,5**.
- **Clientes de agência:** funciona, mas clientes de baixa consciência costumam não entender o Bid Cap ("o que é bid? eu quero lead"); comunicação com o cliente é o problema, não a técnica. Sugestão: manter o que já dá resultado e testar o Bid Cap numa conta separada ("time que ganha não se mexe").
- **Escala baiana:** péssima para testar ou como única estrutura, mas pode ser usada **um dia (ex.: domingo)** para puxar gasto em dia muito bom e depois desligar.
- **Mentoria/consultoria:** só consultoria em tráfego para quem já tem oferta rodando; contato pelo Instagram. Produtos antigos (imersão de Bid Cap) fora de venda.
- **Conselho final:** especialize-se numa coisa (ele em tráfego); "não desistam; sem gastar é normal, é o caminho".

## Divergências em relação ao Guilherme (registro das aulas)
| Ponto | Allanzord | Guilherme ([Detalhe - Estrutura de tráfego CBO + Bid Cap (Guilherme)](Detalhe%20-%20Estrutura%20de%20tr%C3%A1fego%20CBO%20%2B%20Bid%20Cap%20%28Guilherme%29.md), [Detalhe - Checklist do ROI (10 dicas low ticket)](Detalhe%20-%20Checklist%20do%20ROI%20%2810%20dicas%20low%20ticket%29.md)) |
|---|---|---|
| Subir o Bid Cap ao escalar | Mantém o Bid Cap e sobe o orçamento (20–50%/dia) | Escala subindo o Bid Cap e criativos; não mexe no orçamento diário (no checklist: orçamento +30%/dia e reduz o Bid Cap) |
| Pausar criativo | Não pausa só pelo resultado (top spender); descarta oferta após 100–150 ads sem gastar | 3× o Bid Cap sem venda/ROAS abaixo do break even (2× com pouco caixa) |
| Contas | 1–2 contas; 1-1-1 sem Bid Cap em outra conta ao escalar | Uma campanha Bid Cap por conta; nada de ABO/CBO junto |
| Conjuntos | novos ads em conjuntos novos (duplicar conjunto) ou campanha nova | 1 conjunto por ângulo (~5 criativos) |
| Orçamento inicial | 2–3× o ticket | começar baixo (R$ 100–300) perto do Bid Cap |

## Como aplicar nas contas do Arthur
- Para ofertas de **infoproduto/low ticket** (Time Direct Response, Gestão de Obra, A História Cantada): quando for subir o Bid Cap, escolher uma das abordagens e **registrar qual** (a de volume do Allanzord — 100–150 ads para decidir a oferta — é útil para decidir descarte sem queimar caixa; a do Guilherme é mais conservadora no gasto).
- Para as **contas de lead/conversa** dos clientes (maioria TAG/GDM/VILAS MKT): a aula confirma que o Bid Cap também serve para **lead**, com **custo por lead** como base do lance; só vale propor ao cliente se ele entender (comunicação).
- **Rotinas 7h/12h/18h**: gastar sem vender é diferente de **não gastar** — um conjunto Bid Cap sem gasto indica criativo/oferta fraca ou lance baixo; sinalizar isso separadamente de "gastou e não vendeu".

#aulas #bid-cap #cost-cap #cbo #escala #meta-ads
