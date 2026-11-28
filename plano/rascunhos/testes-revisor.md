# Roteiro de testes do Revisor (G-06)

**Tarefa:** G-06 de `plano/DIVISAO-TAREFAS.md` · **Entrada:** `H-20261127-grok-05` · **Autor:** italo — Grok · **Data:** 2026-11-27
**Serve a:** V-02 (rodada etapa por etapa) e à seção 11 de `plano/PLANO-DE-ACAO.md` ("Como testar: quebrar de propósito cada item").

> **Como ler.** Para cada item do checklist: a regra do plano, **como quebrar de propósito** (passos pequenos e reversíveis) e **o que o Revisor deve responder**. Onde o código do Revisor **não** pega a quebra, está dito. **Atualização (código no repositório):** depois que `n8n/tools/codigos.mjs` entrou no `main` (commit `3354704`), rodei os nós Code do Revisor, da copy e do Tráfego com **dados simulados** (sem n8n, sem rede, sem credencial) pelo script `plano/rascunhos/simular-revisor.mjs` e escrevi o resultado na seção 1A. O que está na seção 1A é **verificado em código local**; o que depende do n8n rodando, de HTTP real ou da Meta continua **não verificado** até a V-02.

## 0. Regras de segurança dos testes

1. **Nunca usar a conta de anúncios real** nem ligar nada. Os testes de campanha e anúncio são feitos **com JSON simulado** nos nós de código (sem chamada à Meta) ou com conta de teste do Arthur ciente. **Nunca ativar** campanha, conjunto ou anúncio, nem "só para ver".
2. Páginas de teste usam **pixel fictício** (`PIXEL_DE_TESTE`) e **endereços fictícios** (domínio `.invalid`) ou um endereço que o Italo controla. Nada de dado pessoal real em página de teste.
3. **Cada quebra é uma só.** Mude uma coisa por vez, rode o Revisor, anote, desfaça. Se mudar duas coisas, não dá para saber qual item reprovou.
4. **Sempre rodar antes o caso limpo** ("controle"): página correta, checkout correto, pixel de teste válido. Se o controle não passa, nenhum teste vale.
5. **Aprovado só a 100%.** Basta um item `false` para o Revisor reprovar. O agente de IA **não** aprova sozinho: se o agente disser `aprovado: true` e o código reprovar algum item, o resultado final tem de ser reprovado.

## 1. Resumo: quebra principal e resposta esperada

| # | Item do plano | Quebra principal | Resposta esperada |
|---|---|---|---|
| 1 | `1_pagina_no_ar` | URL que devolve 404 (ou não responde) | item `false`; erro cita o status ou "sem resposta" |
| 2 | `2_pixel_certo_e_pageview` | trocar um dígito do ID do pixel; apagar o `PageView` | item `false`; erro cita o ID esperado e o encontrado |
| 3 | `3_pixel_ja_disparou` | pixel que nunca disparou (ou ID de pixel inexistente) | item `false`; erro cita "sem `last_fired_time`" |
| 4 | `4_links_de_checkout_certos_e_no_ar` | link com outra base; sobra `{{CHECKOUT_URL}}`; checkout 404 | item `false`; erro cita o link ruim |
| 5 | `5_preco_aprovado_e_sem_preco_riscado` | preço diferente; preço riscado | item `false`; erro cita o trecho |
| 6 | `6_idioma_do_destino` | `lang="pt-BR"`; "você" no texto | item `false`; erro cita o trecho |
| 7 | `7_criativos_prontos` | lista vazia; imagem sem URL | item `false`; erro cita qual criativo |
| + | Fora do checklist atual (propostas B1 a B3) | sem UTM e `xcod`; copy com promessa proibida; anúncio ativo | ver seção 4 |
| + | Saída do agente e aprovação | agente aprova com item falho; saída que não é JSON | `revisor_aprovou = false` |

**Lacunas conhecidas do plano** (`plano/PLANO-DE-ACAO.md` §11): o Revisor lê **só o HTML**, sem executar JavaScript; não vê o preço que o checkout desenha por JavaScript nem o `PageView` em navegador real (T-08). O item 7 deve passar a exigir `criativos_aprovados` (T-04). Os testes abaixo marcam onde isso aparece.

## 1A. Resultado da simulação local do código (verificado em código; n8n real e HTTP real seguem não verificados)

Comando: `node plano/rascunhos/simular-revisor.mjs` (Node 24, sem dependência). Cada linha é uma quebra única sobre o caso limpo, que **passa**. "PASSA" onde deveria reprovar é **lacuna do código**, para virar tarefa.

| Teste | Quebra | O código responde | Esperado | Lacuna? |
|---|---|---|---|---|
| 1.1 | página 404 | reprova item 1 | reprovar | não |
| 2.1 | um caractere do ID do pixel trocado | reprova item 2 | reprovar | não |
| 2.3 | sem `PageView` | reprova item 2 | reprovar | não |
| 2.4 | `PageView` só dentro de comentário HTML | **passa** | reprovar | **sim** (regex sobre o HTML bruto) |
| 3.1 | pixel sem `last_fired_time` | reprova item 3 | reprovar | não |
| 3.4 | pixel que disparou há quase 2 anos | **passa** | proposta: janela de 7 dias, como o Construtor | **sim** (só checa se existe) |
| 4.1 | um botão com outra base | reprova item 4 | reprovar | não |
| 4.2 | sobra `{{CHECKOUT_URL}}` | reprova item 4 | reprovar | não |
| 4.4 | checkout 404 | reprova item 4 | reprovar | não |
| 4.7 | link correto, sem `utm` nem `xcod` | **passa** | passa hoje; é a lacuna B1 | **sim** (compara só a parte antes do `?`) |
| 4.9 | 2.º botão para domínio sem "hotmart", "pay." nem "checkout" | **passa** | reprovar | **sim** (só os links que casam com esse filtro são conferidos) |
| 4.10 | 2.º botão em `/checkout/` de outro domínio | reprova item 4 | reprovar | não |
| 5.1 | preço 12,90 em vez de 14,90 | reprova item 5 | reprovar | não |
| 5.2 | preço removido do texto | reprova item 5 | reprovar | não |
| 5.3b | preço 114,90 (contém "14,90") | **passa** | reprovar | **sim** (`includes` do número, sem fronteira) |
| 5.4 | `<s>29,90 €</s>` | reprova item 5 | reprovar | não |
| 5.6 | `text-decoration: line-through` | reprova item 5 | reprovar | não |
| 5.7a | "de 29,90 por" (sem símbolo) | **passa** | ao menos aviso | **sim** |
| 5.7b | "de 29,90 € por" (símbolo depois, formato de Portugal) | **passa** | ao menos aviso | **sim, importante:** a regex exige o símbolo **antes** do número |
| 5.7c | "de € 29,90 por" | reprova item 5 | reprovar | não |
| 6.1 | `lang="pt-BR"` | **passa** | reprovar | **sim, importante:** o código compara só as 2 primeiras letras (`pt`) |
| 6.2 | sem `lang` / `lang="en"` | reprova item 6 | reprovar | não |
| 6.3 a 6.4 | "você", "Você", "vocês", "voce" | reprova item 6 | reprovar | não |
| 6.6 | "celular" (vocabulário do Brasil) | **passa** | o agente deve apontar | esperado: fica com o agente |
| 7.1, 7.2 | lista vazia; criativo sem URL | reprova item 7 | reprovar | não |
| 7.4 | URL que daria 404 | **passa** | proposta: `HEAD` na URL | **sim** (só checa que a URL existe como texto) |
| 8.1 | agente devolve texto livre | `revisor_aprovou = false` | reprovar | não |
| 8.2 | `aprovado: true` com `erros[]` | `revisor_aprovou = false` | reprovar | não |
| 8.4, 8.5 | `aprovado: false`; `aprovado: true` e sem erros | `false`; `true` | `false`; `true` | não |
| 8.3 | agente aprova, um item de código falso | **não testável neste nó**: o cruzamento com o checklist é no nó de saída da etapa | reprovar | testar na V-02 |
| B3.0, B3.3 | plano normal; modelo põe "ACTIVE" no nome | `PAUSED` em tudo; a trava lança erro e nada é enviado | assim | não |
| B3.1 | modelo manda `status: ACTIVE` | o código ignora o campo e envia `PAUSED` | nada ativo | não |
| B3.4, B3.7 | API devolve `ACTIVE` | `tudo_pausado_conferido_na_api = false` | reprovar | não |
| B3.5 | `PAUSED` com `ADSET_PAUSED` | `true` | aprovar | não |
| B3.6 | `PAUSED` com `PENDING_REVIEW` ou `IN_PROCESS` | **`false`** | aprovar (para anúncio) | **sim, para quando os anúncios existirem (C-06):** a regra atual reprovaria um anúncio pausado recém-criado. Hoje só campanha e conjunto são conferidos |
| B3.7b | API não devolve nada | `false` | reprovar | não |

**Copy (B2): o que a regex `CLAIMS_SAUDE` pega** (a mesma regex vale para a saída do Headline Killer e para a página original):

| Trecho | Resultado |
|---|---|
| "Cura a sua artrose", "Perde 10 kg", "Últimas vagas", "Antes e depois" | pega |
| "Cure as suas dores", "**Perca** 10 kg", "perda de 10 kg", "Elimine 5 quilos", "Últimas 10 vagas", "Só hoje", "Antes/depois" | **passa** |
| "Sabemos que sofre de dores nas costas" (atributo pessoal de saúde, regra da Meta) | **passa**: só o agente pode pegar |
| A lista `removido_por_risco` com "antes e depois" ou "últimas vagas" (o prompt do Headline Killer manda preenchê-la) | **pega: falso positivo.** A verificação `sem_claims_de_saude_ou_escassez` lê o JSON inteiro e reprova a **própria lista do que foi removido** |

Consequências a levar ao Claude (C-xx) e ao G-04: (a) trocar `lang` por comparação do idioma completo (`pt-PT`), (b) incluir a forma "de 29,90 € por" na regex de preço riscado, (c) comparar o preço com fronteira de número, (d) parar de ler `removido_por_risco` na checagem de claims (ou mudar o prompt, ver `plano/rascunhos/prompts-revisados.md`), (e) acrescentar "perca", "perda de N kg" e semelhantes, (f) conferir **todos** os botões `a.cta`, não só os que casam com o filtro de link.

## 2. Montar o ambiente de teste

1. **Caso limpo:** um `index.html` de teste com `<html lang="pt-PT">`, `fbq('init','PIXEL_DE_TESTE')` e `fbq('track','PageView')`, o script `dr-utm`, botões `a.cta` apontando para o checkout de teste, o preço aprovado no texto (sem riscar) e texto em PT-PT.
2. **Onde publicar:** um endereço que o n8n alcance (pode ser a hospedagem escolhida em G-03 ou um servidor de teste do Italo). O `url_pagina_publicada` é preenchido à mão.
3. **Variação sem publicar:** para quebras de HTML, edite o arquivo e **publique de novo**, ou rode `node plano/rascunhos/simular-revisor.mjs` (da raiz do repositório), que usa HTML simulado nos mesmos nós Code (mesmo método do `n8n/tools/testar-codigos.mjs`). A simulação não prova HTTP real, regex em navegador nem o comportamento do n8n.
4. **Registro:** uma linha por teste na tabela da seção 6. Guarde a resposta do Revisor (os campos `aprovado`, `erros` e cada verificação).

## 3. Os 7 itens do checklist atual

### Item 1 · `1_pagina_no_ar` (HTTP 200)

| Teste | Como quebrar | O Revisor deve responder |
|---|---|---|
| 1.1 | `url_pagina_publicada` apontando para um caminho que devolve 404 (ex.: `<sua-página>/nao-existe`) | `1_pagina_no_ar: false`; `erros[].onde = "página"`, `problema` com "HTTP 404" |
| 1.2 | `url_pagina_publicada` com domínio que não existe (`https://pagina-teste.invalid`) | `false`, sem derrubar o fluxo (o plano usa `neverError`). O erro deve dizer "sem resposta", **não** "HTTP 200" |
| 1.3 | `url_pagina_publicada` **vazia** | `false` e erro "URL da página não informada". O plano usa `http://invalid.local` quando vazio; não pode virar aprovado |
| 1.4 | Página que redireciona (301) para outra | O plano não diz se redirecionamento conta como 200. Anotar o que acontece (**não verificado**) |

**Observação:** com a página fora do ar, os itens 2, 4, 5 e 6 **também** devem reprovar (não há HTML para ler). Confirmar que **não** passam "por falta de dado".

### Item 2 · `2_pixel_certo_e_pageview` (`fbq('init','<pixel_id>')` e `fbq('track','PageView')` no HTML)

| Teste | Como quebrar | O Revisor deve responder |
|---|---|---|
| 2.1 | Trocar um dígito do ID em `fbq('init', ...)` | `false`; erro com o ID esperado (`config.pixel_id`) e o encontrado |
| 2.2 | Apagar a linha `fbq('init', ...)` | `false`; "init ausente" |
| 2.3 | Apagar `fbq('track','PageView')` | `false`; "PageView ausente" |
| 2.4 | Colocar o `PageView` dentro de **comentário** (`// fbq('track','PageView')` ou `<!-- ... -->`) | **Deve** reprovar, pois não dispara. **Provável lacuna:** uma busca de texto simples aprova. Se aprovar, abrir tarefa (ou resolver com T-08) **Confirmado na simulação (1A): passa.** |
| 2.5 | Dois `fbq('init', ...)` com IDs diferentes | `false`; erro cita os dois |
| 2.6 | Deixar o `<noscript>` do pixel de fora | O plano não cobra o `<noscript>` neste item (só `pixel_injetado` no Construtor). Anotar |

### Item 3 · `3_pixel_ja_disparou` (`last_fired_time` existe)

| Teste | Como quebrar | O Revisor deve responder |
|---|---|---|
| 3.1 | Usar um pixel de teste **novo**, que nunca recebeu evento | `false`; "sem `last_fired_time`" |
| 3.2 | Usar um ID de pixel que não existe | `false`; o erro da Graph API entra na evidência, **sem** virar `true` |
| 3.3 | Token da Meta inválido ou expirado (credencial `DR · Meta` errada **em ambiente de teste**) | `false` com a mensagem do erro (código 190). Nunca aprovar por "não deu para checar" |
| 3.4 | Pixel que disparou há **meses** (data antiga) | Pela regra atual (`existe`), **passa**. O Construtor já cobra "últimos 7 dias" (`pixel_disparou_nos_ultimos_7_dias`). **Proposta:** o Revisor usar a mesma janela. Anotar o comportamento atual |

### Item 4 · `4_links_de_checkout_certos_e_no_ar`

(há links; todos com a mesma base de `hotmart_checkout_url`; sem `{{CHECKOUT_URL}}`; checkout responde 200)

| Teste | Como quebrar | O Revisor deve responder |
|---|---|---|
| 4.1 | Trocar a base de **um** dos botões por outro endereço (ex.: `https://exemplo.invalid/pay`) | `false`; erro com o link divergente (`trecho`) e a base esperada |
| 4.2 | Deixar `{{CHECKOUT_URL}}` num botão | `false`; erro "marcador `{{CHECKOUT_URL}}` não substituído" |
| 4.3 | Remover todos os botões `a.cta` | `false`; "nenhum link de checkout" |
| 4.4 | `hotmart_checkout_url` apontando para um endereço que devolve 404 | `false`; erro cita o status do checkout |
| 4.5 | `hotmart_checkout_url` vazio | `false`; "checkout não informado" |
| 4.6 | Link do botão com `http://` em vez de `https://` | `false` (ou aviso). O plano pede "mesma base"; se a base inclui o esquema, deve reprovar. Anotar |
| 4.7 | Link correto, mas **sem** `xcod` ou UTM | Pelo plano atual **passa**. É a lacuna B1 (seção 4) **Confirmado na simulação (1A).** |
| 4.8 | Checkout da Hotmart que devolve **200 com mensagem de erro dentro da página** (produto despublicado) | O Revisor lê só o status: **passa**. Lacuna: só um navegador (T-08) ou a API de ofertas (`plano/pesquisa/hotmart-api.md`, seção 3.2) detecta. Anotar |

### Item 5 · `5_preco_aprovado_e_sem_preco_riscado`

(o número do `preco_aprovado` aparece no texto; não há preço riscado)

| Teste | Como quebrar | O Revisor deve responder |
|---|---|---|
| 5.1 | Trocar o preço no texto por outro valor (ex.: de 12,90 para 14,90 em **todos** os lugares) | `false`; erro com o valor esperado e os valores achados |
| 5.2 | Remover o preço do texto | `false`; "preço aprovado não encontrado" |
| 5.3 | Escrever o preço aprovado só num depoimento ou numa frase solta, e outro valor no botão | Pela regra ("aparece no texto") **passa**. É falso positivo provável: anotar. **Proposta:** exigir o preço perto do botão |
| 5.4 | Preço riscado com `<del>` ("~~29,90~~ 12,90") | `false`; "preço riscado" com o trecho |
| 5.5 | Preço riscado com `<s>` ou `<strike>` | `false`, igual a 5.4 |
| 5.6 | Preço riscado com CSS (`text-decoration: line-through` ou classe `.antigo`) | `false` **ou** lacuna. Uma busca só por tags não pega; anotar |
| 5.7 | "De 29,90 por 12,90" **sem** risco | A regra é "preço **riscado**", mas o plano e o `contexto/` pedem sem preço de comparação falso. Deve ao menos virar aviso. Anotar o que acontece **Simulação (1A): passa**, inclusive "de 29,90 € por" (formato de Portugal). |
| 5.8 | Preço apenas dentro de **imagem** | Sem número no texto: `false` (5.2) |
| 5.9 | Formato do número: "12,90 €", "12.90€", "€12,90" | Todas as formas devem ser reconhecidas **ou** o erro deve dizer qual formato esperava. Anotar |

**Limite:** o preço que o checkout mostra por JavaScript não passa por aqui (T-08). Para o preço **no checkout**, a conferência confiável é a API de ofertas da Hotmart (`price.value` e `price.currency_code`), ver `plano/pesquisa/hotmart-api.md`.

### Item 6 · `6_idioma_do_destino` (`<html lang>` e, em pt-PT, sem "você")

| Teste | Como quebrar | O Revisor deve responder |
|---|---|---|
| 6.1 | `<html lang="pt-BR">` | `false`; erro cita `lang` esperado `pt-PT` (destino) e o encontrado. **Confirmado na simulação (1A): o código atual deixa passar** (compara só `pt`). O agente deve apontar enquanto isso |
| 6.2 | Remover o atributo `lang` | `false`; "lang ausente" |
| 6.3 | Escrever "você" uma vez no texto ("Você vai gostar...") | `false`; `trecho` com a frase; `correcao` sugere "para si" ou a forma PT-PT |
| 6.4 | "Você" com maiúscula, "VOCÊ", "voce" sem acento, "vocês" | `false` para todas. **Provável lacuna:** busca que só vê "você" minúsculo. Anotar |
| 6.5 | Verbo no gerúndio brasileiro ("estou fazendo", "vai estar treinando") em vez de "a fazer", "a treinar" | O **agente** deve apontar (`erros[]`); a regra de código não pega. Anotar |
| 6.6 | Vocabulário do Brasil ("celular", "time" no sentido de equipa, "café da manhã") | O agente deve apontar. Anotar |
| 6.7 | Texto 100% em inglês com `lang="pt-PT"` | O agente deve reprovar (idioma real ≠ declarado) |

**Exemplo de texto bom (PT-PT):** "Descubra, em casa e ao seu ritmo, um programa pensado para si." **Exemplo ruim (PT-BR), para a quebra 6.3:** "Você vai fazer tudo no seu celular."

### Item 7 · `7_criativos_prontos` (todas as imagens da Claquete têm URL)

| Teste | Como quebrar | O Revisor deve responder |
|---|---|---|
| 7.1 | Lista de criativos **vazia** | `false`; "nenhum criativo" |
| 7.2 | Uma imagem com `url` vazia ou ausente | `false`; erro com o **nome ou número** do criativo |
| 7.3 | Menos imagens do que o planejado (ex.: planejadas 6, com 4) | Pela regra ("todas têm URL") **passa**. **Lacuna:** falta comparar com o total planejado. Anotar |
| 7.4 | URL que **expirou** (devolve 404; o plano avisa que URLs da xAI podem expirar) | Pela regra **passa**. **Proposta:** `HEAD` na URL e conferir `200` e `Content-Type: image/*`. Anotar |
| 7.5 | `criativos_aprovados` falso (T-04), com URLs ok | Hoje **passa**; deve **reprovar** quando T-04 existir. Teste fica pendente até T-04 |
| 7.6 | Imagem com texto de saúde proibido ou "antes e depois" | O agente deve reprovar (ver B2). A regra de URL não vê o conteúdo |

## 4. Itens que o plano ainda não cobre no Revisor (propostas)

Estes três vêm do que o projeto promete (regras fixas), mas **não estão entre os 7 itens do plano**. Estão aqui para decidir se entram no checklist.

### B1 · UTM e `xcod` nos links (regra fixa: provar que o link leva `utm_content={{ad.id}}`; na Hotmart, `xcod={{ad.id}}`)

O Construtor já tem `utm_na_pagina_publicada` (script `dr-utm` presente). Falta conferir os **anúncios** e o `xcod`.

| Teste | Como quebrar | Resposta esperada |
|---|---|---|
| B1.1 | Remover o script `dr-utm` do HTML publicado | Reprova: "script `dr-utm` ausente" (já coberto pelo Construtor; o Revisor deve repetir) |
| B1.2 | `dr-utm` presente, mas **sem** repassar `xcod` (como no plano hoje) | **Deve** reprovar: "`xcod` não repassado ao link da Hotmart". Lacuna conhecida: ver `plano/pesquisa/hotmart-api.md`, seção 7 |
| B1.3 | Criativo com `url_tags` **sem** `utm_content={{ad.id}}` | Reprova com o valor lido da API (`GET /{creative_id}?fields=url_tags`) |
| B1.4 | `url_tags` com macro errada (`{{ad_id}}`, `{{ad.ID}}`, `{ad.id}`) | Reprova: macro inválida. Macros válidas: `{{ad.id}}`, `{{adset.id}}`, `{{campaign.id}}` e as de nome |
| B1.5 | `{{ad.id}}` colocado **dentro do `link`** do criativo, não em `url_tags` | Reprova (a documentação manda usar `url_tags`; ver `plano/pesquisa/meta-ads-api.md`, seção 4.2) |

**Observação:** `{{ad.id}}` só vira número quando o anúncio é **exibido**. Antes do Arthur ativar, a prova possível é a leitura de `url_tags` no criativo (API). A prova final (o número no endereço da página depois do clique) só existe com o anúncio ativo, e quem ativa é o Arthur.

### B2 · Copy (revisão pelo agente, saída `erros[{onde,trecho,problema,correcao}]`)

Testes de **conteúdo** que o agente deve reprovar. Em todos: `aprovado: false` e um item de `erros[]` com `trecho` literal.

| Teste | Trecho a inserir (exemplos fictícios) | Problema esperado |
|---|---|---|
| B2.1 | "Cura a sua artrose em 7 dias." | Promessa de saúde/cura (regras de saúde da Meta e regra do projeto) |
| B2.2 | "Perca 10 kg em 1 semana." | Resultado garantido/irrealista |
| B2.3 | "Sabemos que sofre de dores nas costas." | Atribui condição de saúde pessoal ao leitor |
| B2.4 | "Maria, 58 anos, perdeu 12 kg com o método." (sem prova) | **Depoimento inventado** (regra: nada de prova social inventada) |
| B2.5 | "Mais de 20 mil alunas" ou "7 anos de experiência" sem confirmação (P-06) | Número não confirmado |
| B2.6 | "Garantia de 30 dias" quando a decisão (P-03) é outra | Garantia diferente da aprovada |
| B2.7 | "Só hoje: de 29,90 por 12,90" | Preço de comparação falso e urgência falsa |
| B2.8 | Sobrar `[PREÇO]`, `[FORMATO]`, `[GARANTIA A DEFINIR PELO PRODUTOR]` ou `[ESPAÇO PARA PROVA REAL]` | Marcador pendente. **Proposta:** verificação **por código** (`sem_marcadores_pendentes`: nada entre colchetes em maiúsculas e nada em `{{...}}`), sem depender do agente. O item 4 só cobra `{{CHECKOUT_URL}}` |
| B2.9 | Página que usa nome ou imagem de terceiros sem autorização registrada (P-04) | O agente não consegue saber. Isto fica como **checagem humana** |

### B3 · Campanhas, conjuntos e anúncios PAUSADOS (é do Tráfego, depois do Revisor; regra fixa: só o Arthur ativa)

O Revisor roda **antes** do Tráfego. A trava de `PAUSED` e a `Conferência PAUSADO` ficam no workflow 07. **Testar só com JSON simulado, sem chamar a Meta:**

| Teste | Como quebrar (entrada simulada) | Resposta esperada |
|---|---|---|
| B3.1 | Payload do `Payload PAUSADO` com `status: "ACTIVE"` em uma campanha | **Erro e nada enviado** (a trava lança exceção) |
| B3.2 | Payload com um conjunto **sem** `status` | Erro (status ausente não pode virar "ativo por padrão") |
| B3.3 | Payload com a palavra `ACTIVE` em qualquer campo (ex.: nome da campanha) | Erro, pela regra "qualquer `status` diferente de `PAUSED` ou a palavra `ACTIVE`" |
| B3.4 | Resposta simulada da API: `status: "ACTIVE"` | `Conferência PAUSADO` reprova; `tudo_pausado_conferido_na_api: false` |
| B3.5 | Resposta simulada: `status: "PAUSED"` e `effective_status: "ADSET_PAUSED"` (conjunto pausado) | Aprova |
| B3.6 | Resposta simulada de **anúncio recém-criado**: `status: "PAUSED"`, `effective_status: "PENDING_REVIEW"` ou `"IN_PROCESS"` | **Deve aprovar** (anúncio pausado em revisão). Pela regra atual do plano (só `PAUSED`, `CAMPAIGN_PAUSED`, `ADSET_PAUSED`), reprovaria: bug a corrigir, ver `plano/pesquisa/meta-ads-api.md`, seção 4.4 |
| B3.7 | Resposta simulada: `effective_status: "ACTIVE"` e `status: "PAUSED"` | Reprova (qualquer `ACTIVE` efetivo é erro) |
| B3.8 | Conjunto com destino na UE **sem** `dsa_payor` ou `dsa_beneficiary` | Erro antes de enviar (proposta 2 de `meta-ads-api.md`); sem isso, a Meta recusa |
| B3.9 | Rodar o Tráfego **duas vezes** com os mesmos dados (idempotência, T-07) | Não duplica: a 2.ª rodada acha a campanha pelo nome fixo, **reaproveita** e não cria nem altera nada (inclusive não volta a pôr `PAUSED`, porque o Arthur pode ter ativado). **Só com conta de teste.** Verificar também o caso ruim: se o filtro por nome da Meta for ignorado, o código reaproveita a 1.ª campanha da conta (ver `meta-ads-api.md`, seção 5, item 7) |

**Nunca** reproduzir B3.1 a B3.4 com chamada real. A trava é do **nosso** código; o que testamos é que ela dispara.

## 5. Saída do agente e aprovação final

| Teste | Como quebrar | Resposta esperada |
|---|---|---|
| 8.1 | O agente devolve texto livre, não JSON | `saida_do_agente_em_json: false`; `revisor_aprovou: false` |
| 8.2 | O agente devolve `aprovado: true` **com** `erros` não vazio | `revisor_aprovou: false` (regra: `aprovado === true` **e** nenhum erro) |
| 8.3 | O agente devolve `aprovado: true`, mas um dos 7 itens de código é `false` | `revisor_aprovou: false`. **O código manda; o agente não aprova sozinho** |
| 8.4 | O agente devolve `aprovado: false` e todos os 7 itens são `true` | `revisor_aprovou: false` |
| 8.5 | Todos os 7 itens `true`, agente `aprovado: true`, `erros: []` (caso limpo) | `revisor_aprovou: true` |
| 8.6 | Rodar o Revisor com **6 de 7** itens verdadeiros | `aprovado: false` (só aprova a 100%) |
| 8.7 | Rodar o Revisor sem `url_pagina_publicada`, `hotmart_checkout_url` ou `pixel_id` (pré-requisitos do §11) | Falha clara de pré-requisito; **não** aprovar nem travar em silêncio |

## 6. Tabela de execução (preencher durante o teste)

Legenda: ✅ o Revisor respondeu como o esperado · ❌ respondeu errado (lacuna) · ⬜ não rodado.

| Teste | Data | Quem | Resposta do Revisor (resumo) | Resultado | Lacuna encontrada |
|---|---|---|---|---|---|
| Controle (caso limpo) | | | | ⬜ | |
| 1.1 a 1.4 | | | | ⬜ | |
| 2.1 a 2.6 | | | | ⬜ | |
| 3.1 a 3.4 | | | | ⬜ | |
| 4.1 a 4.8 | | | | ⬜ | |
| 5.1 a 5.9 | | | | ⬜ | |
| 6.1 a 6.7 | | | | ⬜ | |
| 7.1 a 7.6 | | | | ⬜ | |
| B1.1 a B1.5 | | | | ⬜ | |
| B2.1 a B2.9 | | | | ⬜ | |
| B3.1 a B3.9 | | | | ⬜ | |
| 8.1 a 8.7 | | | | ⬜ | |

**Critério de aceite do Revisor (V-02):** o controle passa; **cada** quebra dos itens 1 a 7 e de 8.1 a 8.7 reprova com o item certo `false` e com uma evidência em `erros[]`. Os testes marcados "provável lacuna" ou "anotar" **não** reprovam o Revisor se o resultado for diferente do esperado: viram tarefas novas (T-xx) com o comportamento observado.

## 7. O que ficou não verificado

| Tema | Onde procurei |
|---|---|
| Comportamento dos nós no n8n real (HTTP, `neverError`, cruzamento do checklist com a saída do agente, item 8.3) | `n8n/tools/gerar.mjs` e `plano/PLANO-DE-ACAO.md` §11; só a V-02 confirma. A lógica dos nós Code foi simulada em `plano/rascunhos/simular-revisor.mjs` |
| Formato dos dados simulados do `testar-codigos.mjs` | `plano/PLANO-DE-ACAO.md` §14 (só cita a ferramenta) |
| Se redirecionamento 301 conta como "no ar" | regra do plano diz só "HTTP 200" |
| Se o checkout da Hotmart devolve 200 para produto despublicado | sem checkout real; ver `plano/pesquisa/hotmart-api.md` |
| Como a Meta expande `{{ad.id}}` na prática (só na entrega) | `plano/pesquisa/meta-ads-api.md`, seção 4.2 |
