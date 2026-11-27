---
tags: [aula, aula-detalhada, trafego, bid-cap, cbo, andromeda, escala, metricas, low-ticket]
atualizado: 2026-11-26
fonte: https://www.youtube.com/watch?v=TzF5zEa3yTA
transcricao: raw/aulas/TzF5zEa3yTA.txt
professor: Guilherme (mentoria "Escale", canal Germano Morandi) — Aula 01, ~47 min, com perguntas dos alunos
nota_resumo: "[Estrutura de tráfego](../Estrutura%20de%20tr%C3%A1fego.md)"
---
# Detalhe — Estrutura de tráfego: CBO + Bid Cap pós-Andromeda (Aula 01)

Versão aprofundada feita pelo Grok Bot (26/11/2026) a partir da transcrição completa. Resumo rápido do Claude Code: [Estrutura de tráfego](../Estrutura%20de%20tr%C3%A1fego.md). Índice: [Aulas - Índice e Playbook](../Aulas%20-%20%C3%8Dndice%20e%20Playbook.md). Complementa: [Detalhe - Bid Cap (Allanzord)](Detalhe%20-%20Bid%20Cap%20%28Allanzord%29.md) e [Detalhe - Checklist do ROI (10 dicas low ticket)](Detalhe%20-%20Checklist%20do%20ROI%20%2810%20dicas%20low%20ticket%29.md).

Contexto: o professor mostra uma campanha real dele rodando com **ROI 2,24 no dia** (ticket em torno de R$ 150, ~10 vendas/dia; "quase um salário mínimo no dia"), gravada em **4 de junho** (data dita na aula). Diz que não inventou o método: usa o que o **Andromeda** (última atualização da Meta) recomenda e dá crédito ao Allanzord. Princípio: **"quanto mais básico, melhor"** — algo complexo aumenta a chance de esquecer uma parte e desmoronar a estrutura.

## Por que Bid Cap + CBO
- **Andromeda recompensa estabilidade**: uma campanha com orçamento alto, adicionando criativos nela, em vez de criar campanhas novas e duplicar. A "escala baiana" (duplicar) funciona pouco agora.
- **ABO está morrendo** (a Meta planeja descontinuar) — não vale usar algo em descontinuação.
- **Bid Cap = limite de lance = stop loss por leilão.** Bom para quem não tem muito caixa (a pesquisa com os alunos mostrou que a maioria não tem R$ 10–20 mil para queimar). A Meta decide **dentro do teto** que você define.
- Quanto menos tempo no gerenciador melhor; ele olha cada oferta **1 vez por dia**.

## Pré-requisitos (quem tem sai na frente)
1. **Break even calculado** (zero a zero) — inclui imposto da Meta e imposto de CNPJ; use a IA para calcular com ticket médio e impostos. Ticket médio R$ 35 pago a R$ 35 por venda **não** é break even por causa dos impostos.
2. **Criativo já validado** (se não tiver, sobe e valida no Bid Cap, mas é bem melhor ter).
3. **Pixel + API de conversões** (rastreamento avançado). O pixel faz muita diferença nas operações dele. Sem nada disso: começar em **CPO com volume mais alto** (mais vendas, não compras mais cheias) até **20–30 compras** para otimizar o pixel. Um pixel com **200+ vendas performa muito mais** (resposta a um aluno).
- Oferta validada ajuda: sem os pré-requisitos "você começa em passos lentos, mas sem gastar muito, proporcional".

## Estrutura da conta (regras fixas)
- **Uma única campanha Bid Cap, CBO, na conta de anúncio.** Todas as outras campanhas ficam **desativadas** (senão a inteligência é compartilhada e a Bid Cap não performa). **Nunca** ter Bid Cap + ABO nem Bid Cap + CBO comum na mesma conta.
- **1 conjunto de anúncios por ângulo**, em média **5 criativos por conjunto** (pode variar; na campanha mostrada havia conjuntos com 10, 5, 3 e 2). Ex.: oferta de doces → um conjunto "ganhe dinheiro vendendo doce"; outro "acima do peso quer doce saudável".
- **Público: Advantage+ total.** Sem interesses, sem excluir posicionamentos. Gênero e idade: na dúvida deixa **aberto** em todas as ofertas; "a segmentação fica no criativo" (ex.: hook "para você que está acima do peso" nos primeiros 5 s).
- **Nunca duplicar** campanha ou conjunto (mata a Bid Cap). Nada de "fatias de público" nem interesses.

## Criativos: volume e diversidade
- Precisa de **muito volume** e **diversidade**: **5 criativos totalmente diferentes** (copy e ângulo) **valem mais que 20 variações** de um validado (a ideia de "camiseta verde/azul, dia/noite" não funciona bem no Andromeda).
- Variação que funciona: **pegar o hook validado e trocar o body** (corpo), ou copiar começo/metade/fim e trocar o resto.
- Caso de aluno: 3 criativos validados na ABO **sem vendas no Bid Cap** em 2 dias; a causa não era conta nova nem o criativo, era a **quantidade/diversidade** (os 3 eram variantes do mesmo). Recomendação: ter **3 criativos bons + ~10 medianos** para o Meta gastar e puxar inteligência; manter até **7 dias** com mais criativos.
- **Imagem:** ele **parou de rodar imagem no Bid Cap**: imagem sempre tem CTR muito maior (não existe hook/hold), e o Bid Cap prioriza gastar no CTR alto, então gasta mais em imagem que em vídeo (que converte mais). Dado de data da gravação (4/6); "talvez mude com atualização".

## Valor do Bid Cap
- Opções que ele já citou: ~metade do ticket médio, break even, acima do ticket. O que ele ensina agora:
  - **+30% acima do break even** (ex.: produto de R$ 100 sem imposto → bid cap R$ 130) para "agressivar" e validar/otimizar o pixel com mais vendas;
  - **Pós-Andromeda: até +50%** acima do break even se não estiver gastando. **Ele começa as ofertas assim**: ticket R$ 100 → Bid Cap R$ 150; na campanha mostrada colocou **+50% do ticket médio** (ex.: R$ 130 em conjuntos validados).
- **Se o conjunto não gasta, ele não vai performar.** Conjuntos que o Meta "poupa" são normais; os que gastam são os com ROAS bom. Exemplo: conjunto com ROAS alto acumulado e R$ 7.000 gastos pode não gastar hoje — "se ele gastasse eu jogaria fora meu ROI de hoje". O Meta não é o inimigo; quer que você venda.
- Colocou ao vivo: onde o Bid Cap estava em R$ 100 e o conjunto não gastava → subiu para **R$ 120–130** ("o máximo do mínimo que ele consegue pagar"); como o CPA real fica bem abaixo do lance, subir só deixa o Meta entrar nos leilões.

## Métricas (ordem de importância)
1. **Vendas** (resultados) e **valor dos resultados** (mostra qual conjunto/criativo traz mais order bump e upsell).
2. **Initiate Checkout (IC)** — varia por oferta. Na campanha mostrada: ~**4,5 ICs por venda** em média; todos os conjuntos se comportavam igual → oferta atrai curioso, não é checkout ruim. Um conjunto com 10 ICs/0 vendas foi desativado.
3. **CPC** (terciário; ele tem oferta com CPC R$ 3 e CPA baixo); foque em **vendas, ROAS e custo por resultado**.
4. **Hook rate (3 s)** e **hold rate** (ele usa 25%): servem para **fazer novos criativos**, não para decidir se dá ROI (há criativo sem hook/hold que vende e criativo com muito hook só de curiosidade).
5. **CPM por último**: nessa oferta ~**R$ 29** (com **567 vendas** no pixel, desce); média Brasil ~**R$ 50**; EUA ~**R$ 200–300** em ofertas que rodou; CPM estranho só se for 150–200 no Brasil.
6. **CTR único**: engana; não otimizar por ele (imagem sempre dá CTR alto).
- Sempre olhar **macro (30 dias) e micro (hoje e 7 dias)**: pode-se pausar o que hoje não vendeu mas nos 30 dias vendeu R$ 100.000. Ao mandar para a IA, envie macro e micro. IAs às vezes leem mal CPA/valor do resultado — confira.
- Coluna importante: **"Estratégia de lance"** (arrastar para o início) mostra o Bid Cap de cada conjunto.

## Quando pausar um criativo
- Regra: **3× o Bid Cap gasto sem venda ou com ROAS abaixo do break even → pausa** (ex.: Bid Cap R$ 130 → R$ 390). Com **caixa limitado** (R$ 1.000–1.500 para anúncios): **2×**.
- ROAS negativo e zero vendas também é pausa. Exemplo de margem: break even R$ 100, criativo gastou R$ 150 sem venda, ele deixou chegar a R$ 200 → 2 vendas e escalou depois.

## Quando e como escalar
- **Não mexer no orçamento diário** para escalar (ex.: orçamento R$ 6.000, gastando R$ 600/dia — aumentar para 1.000 ou 10.000 não muda nada; gastou até ~10% do orçamento). Se o orçamento está inflado, o melhor é gastar perto dele; no começo coloque algo como R$ 300 e só aumente se gastar tudo.
- **Escala = subir o Bid Cap** (para o Meta entrar em mais leilões) **+ subir mais criativos.** Enquanto o CPA real ficar abaixo do break even, subir o lance mantém ROI (ex.: break even ≈ R$ 150; subir lance de 100 para 120 mantém ROI se vender com o CPA atual).
- Meta dele: escalar para R$ 10k/dia; R$ 700 de lucro no dia "não muda minha vida".
- **Cadência de criativos:** no mínimo **1 lote por semana** (lote = no mínimo 5 criativos em conjunto novo); pode subir 2×/semana (10/semana) e, na escala, até 100/semana. Ele sobe **toda segunda-feira às 00:01** (programado; domingo já com criativos prontos) para evitar o cold start de madrugada (gasta pouco). **Ficar 15 dias sem subir lote novo "mata" a campanha** (aconteceu com ele; "o ROI vai despencar"). Cadência por criativo será aula futura.
- **Detalhamento por idade a cada 14 dias** (botão "Detalhamento" → idade; também por posicionamento): ex. no dia, compraram 25–44; vendas de 25–34 quase R$ 40.000 vs menos de R$ 500 em 65+ (ROAS maior, mas sem escala → aceita-se ROAS menor para vender muito mais). Só restringir idade/posicionamento se algo gastou muito e não vendeu (ex.: R$ 1.000 em 65+ sem venda). A faixa de ouro muda com o nicho (nutra/cápsula = mais velho; info de games = mais novo). Segmentar **depois** é diferente de entrar segmentado.

## Erros que matam (recap do professor)
1. Duplicar campanha/conjunto. 2. Ter qualquer outra campanha ativa (ABO/CBO) junto do Bid Cap. 3. Selecionar interesses/fatias de público. 4. Mexer no orçamento diário para escalar. 5. Pausar criativo antes de 3× o Bid Cap (2× se pouco caixa). 6. Subir poucos criativos/muito parecidos. 7. Ler métrica errada (e deixar a IA ler errado). 8. Ficar sem subir criativo novo. 9. Rodar imagem no Bid Cap.

## Perguntas dos alunos
- **Prejuízo ao subir uma oferta é normal?** Sim, "prejuízo relativo": R$ 40–50 (≈ 1–2 tickets) em um dia ruim é 100% normal; dias de ROI negativo existem mesmo nas ofertas boas (ele cita que o dia seguinte à subida de criativos novos costuma ser ruim).
- **ABO performando melhor que o Bid Cap?** Não desligar a ABO: **subir o Bid Cap em outra conta de anúncio** (mesmo pixel, mesmo checkout, mesmos criativos — pelo menos 5–10) e comparar; se o Bid Cap for melhor, ir migrando orçamento. Se o aluno quer mudar da ABO, é porque algo (escala/imprevisibilidade "tigrinho") o incomoda; migrar logo e aprender a fazer criativos diferentes.
- **Teste de criativo no Bid Cap:** vale muito, por causa de volume e diversidade.
- **Vários criativos num conjunto:** com 5 criativos bem diversos, suba todos no mesmo conjunto (não vale 1 criativo por conjunto).
- **Material:** o professor envia o mapa mental em **HTML** (também .md); dica: mande para a IA/Claude e nomeie "Franklin metodologia" para ela lembrar e otimizar campanhas com ela; também usa áudios para "alimentar" a IA com o que aprende (ex.: dicas do Allanzord).

## Como aplicar nas contas do Arthur
- Para as contas de **infoproduto/low ticket** (ex.: Gestão de Obra, A História Cantada, e as ofertas do Time Direct Response): estrutura de uma campanha CBO Bid Cap por conta, Advantage+, 1 conjunto por ângulo (~5 criativos), lote semanal de criativos, e leitura macro (30 d) + micro (hoje/7 d). Bid Cap inicial sugerido pela aula: break even +30% (até +50% se não gastar).
- Nas **análises diárias do Grok Bot** (Grok Bot - rotinas de análise): um conjunto parado com Bid Cap baixo pode ser **normal**; só sinalizar como problema se o conjunto com ROAS alto não gasta há dias (sugerir subir o lance) e conferir se há lote novo de criativos há < 7 dias. Para criativo com gasto ≥ 3× o lance sem venda: sinalizar para pausa. O painel do Arthur não traz a estratégia de lance por conjunto (limite conhecido).
- **Clientes de serviço/conversas** (maioria das contas da TAG/GDM, objetivo mensagens): a aula é focada em vendas de low ticket com pixel; usar só como referência de princípios (criativos diversos e em volume, uma estrutura básica, não duplicar).

#aulas #trafego #bid-cap #cbo #andromeda #escala
