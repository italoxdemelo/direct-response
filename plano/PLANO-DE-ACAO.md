# Plano de ação — Desafio Pilates em Casa 50+ em Portugal

Plano para levar a primeira oferta do projeto do papel até as campanhas no ar. É um documento **editável**: cada pessoa marca o que fez, quando e com que evidência. Criado em 2026-11-26 (entrada `H-20261126-italo-02`).

- **Quem trabalha nele:** Italo (n8n, infraestrutura, GitHub) e Arthur (decisões, contas Hotmart e Meta, aprovações, ativação).
- **Agentes:** os 8 workflows `Direct Response` do n8n do Italo (`00 Coordenador (GROK BOT)` e `01 Radar` a `07 Tráfego`). Quando uma tarefa é feita por um agente, o responsável humano é quem rodou e conferiu.
- **De onde vêm as tarefas:** pendências `P-xx` e etapas `E-xx` de `historico/MAPA-DEPENDENCIAS.md`, e o contexto em `contexto/00-LEIA-PRIMEIRO.md`.

---

## Como marcar uma tarefa

1. Abra este arquivo no GitHub e clique no lápis (**Edit**), ou edite localmente.
2. Na linha da tarefa, troque o **Status** e preencha **Feito por**, **Data** e **Evidência**.
3. Acrescente uma linha em [Registro de quem fez o quê](#registro-de-quem-fez-o-quê) no fim do arquivo.
4. Se a tarefa mudou alguma coisa (arquivo, decisão, plataforma externa), ela também precisa de uma entrada em `historico/CHANGELOG.md` (regra do `AGENTS.md`). Coloque o ID dessa entrada (`H-...`) na coluna **Evidência**.
5. Commit com mensagem começando pelo ID da entrada, por exemplo `H-20261127-arthur-01: aprovar preço`.

**Status:**

| Símbolo | Significa |
|---|---|
| ⬜ | A fazer |
| 🟡 | Em andamento |
| ✅ | Feito (com evidência) |
| ⛔ | Bloqueado (diga por quê em Evidência / observações) |
| ➖ | Não se aplica / descartado (diga por quê) |

**Colunas:** *Responsável* é quem deve fazer. *Feito por* é quem de facto fez. *Depende de* lista o que precisa estar ✅ antes.

**Regras que valem para todas as fases** (do `AGENTS.md`): nunca inventar dados; sem prova social falsa nem preço riscado de valor nunca praticado; regras de saúde da Meta; PageView conferido antes de qualquer anúncio; campanhas sobem **sempre PAUSADAS** e só o Arthur ativa; preço, formato, garantia e copy final só com o ok do Arthur, registrado no histórico; nenhuma senha, token ou chave neste repositório.

---

## Visão geral

| Fase | O quê | Quem puxa | Depende de |
|---|---|---|---|
| 0 | Organização e repositório | Italo | — |
| 1 | Decisões do Arthur sobre a oferta | Arthur | — |
| 2 | Contas, acessos e credenciais | Arthur + Italo | — (corre em paralelo com a fase 1) |
| 3 | Copy final aprovada | Headline Killer + Arthur | Fase 1 |
| 4 | Produto e checkout na Hotmart | Funil + Arthur | Fases 1 e 2 |
| 5 | Página com pixel e UTM | Construtor | Fases 2, 3 e 4 |
| 6 | Criativos | Claquete + Arthur | Fase 3 |
| 7 | Revisão final | Revisor | Fases 4, 5 e 6 |
| 8 | Campanhas pausadas | Tráfego | Fase 7 |
| 9 | Ativação e acompanhamento | Arthur | Fase 8 |

As fases 1 e 2 podem andar ao mesmo tempo. A fase 6 pode começar assim que a copy estiver aprovada, em paralelo com as fases 4 e 5.

---

## Fase 0 — Organização e repositório

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 0.1 | Revisar e mesclar o PR #1 (histórico de 26/11) e o PR deste plano | — | Italo | ⬜ | | | |
| 0.2 | Instalar a Claude GitHub App em `italoxdemelo` com acesso a `direct-response` (P-11), para o Claude registrar sem usar o navegador | — | Italo | ⬜ | | | github.com/apps/claude/installations/select_target |
| 0.3 | Arthur confirma acesso ao repositório e lê `AGENTS.md` e este plano | — | Arthur | ⬜ | | | |
| 0.4 | Combinar por onde o Arthur dá os "ok" (WhatsApp, comentário no GitHub, etc.), para registrar no histórico com data e canal | — | Italo + Arthur | ⬜ | | | |

## Fase 1 — Decisões do Arthur sobre a oferta

Sem estas decisões a copy não pode ser fechada (P-08). Detalhes e opções em `contexto/00-LEIA-PRIMEIRO.md` §5.

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 1.1 | Decidir o formato das aulas `[FORMATO]` (P-01): ao vivo no fuso de Lisboa, gravadas, PDF + vídeos curtos, instrutora em PT | — | Arthur | ⬜ | | | |
| 1.2 | Decidir o preço em euro `[PREÇO]` (P-02). Referência 9,90–14,90 €; sem preço riscado | — | Arthur | ⬜ | | | |
| 1.3 | Decidir garantia / reembolso na UE (P-03): livre resolução de 14 dias ou regra explícita no checkout | — | Arthur | ⬜ | | | |
| 1.4 | Definir quem assina a oferta em PT (P-04): Lays Trancoso / Lays Sant'anna ou instrutora e marca locais | — | Arthur | ⬜ | | | |
| 1.5 | Juntar depoimentos reais e autorizados, ou decidir lançar sem eles (P-05) | — | Arthur | ⬜ | | | Sem cura clínica nem perda de peso numérica |
| 1.6 | Confirmar ou retirar "7 anos" e "20 mil mulheres 50+" (P-06) | 1.4 | Arthur | ⬜ | | | |
| 1.7 | Confirmar os entregáveis reais (P-07): gravações por 12 meses, grupo de WhatsApp, guia de compras | 1.1 | Arthur | ⬜ | | | Se algum não existir, a copy muda |
| 1.8 | Produzir ou separar os entregáveis confirmados (aulas, guia, grupo) | 1.7 | Arthur | ⬜ | | | |

## Fase 2 — Contas, acessos e credenciais

Os valores (senhas, tokens, chaves, IDs ligados a token) ficam **só no n8n** ou no `.env`. Aqui só se marca **que** foi feito.

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 2.1 | Conta de produtor na Hotmart pronta para vender em euro, e acesso combinado (P-09) | — | Arthur | ⬜ | | | |
| 2.2 | Meta Business: conta de anúncios, pixel criado e utilizador de sistema com token (P-09) | — | Arthur | ⬜ | | | |
| 2.3 | Chave da API xAI (Grok) para o coordenador | — | Italo | ⬜ | | | |
| 2.4 | Preencher no n8n a credencial `DR · xAI Grok` (P-12) | 2.3 | Italo | ⬜ | | | |
| 2.5 | Preencher no n8n a credencial `DR · Meta (token de sistema)` (P-12) | 2.2 | Italo | ⬜ | | | |
| 2.6 | Preencher no n8n a credencial `DR · Hotmart` (P-12) | 2.1 | Italo | ⬜ | | | |
| 2.7 | Preencher `pixel_id` e `ad_account_id` no nó `⚙ Configuração` do n8n (país continua Portugal, pt-PT, EUR) | 2.2 | Italo | ⬜ | | | Valores não entram no Git |
| 2.8 | Definir domínio e hospedagem da página de vendas | — | Italo + Arthur | ⬜ | | | |
| 2.9 | Teste do `00 Coordenador (GROK BOT)` com execução manual, sem publicar página nem criar campanha | 2.4 | Italo | ⬜ | | | |

## Fase 3 — Copy final aprovada

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 3.1 | Headline Killer atualiza a copy com as decisões da fase 1 (substitui `[PREÇO]`, `[FORMATO]`, `[GARANTIA A DEFINIR PELO PRODUTOR]`, `[ESPAÇO PARA PROVA REAL]`, `[PROVA REAL A CONFIRMAR]`) | 1.1–1.7 | `02 Headline Killer` (Italo roda) | ⬜ | | | Base: `contexto/02-entrega-headline-killer.md`; nova versão fora de `contexto/` |
| 3.2 | Arthur aprova a copy da página, as headlines e os roteiros (P-08) | 3.1 | Arthur | ⬜ | | | Registrar o ok com data e canal |
| 3.3 | Marcar `copy_aprovada` no n8n | 3.2 | Italo | ⬜ | | | |

## Fase 4 — Produto e checkout na Hotmart (E-03)

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 4.1 | Marcar `preco_aprovado` no n8n com o preço decidido em 1.2 | 1.2 | Italo | ⬜ | | | |
| 4.2 | Criar o produto na Hotmart com checkout em € e a garantia decidida | 1.2, 1.3, 1.7, 2.6, 4.1 | `04 Funil (Hotmart)` + Arthur | ⬜ | | | |
| 4.3 | Decidir se haverá order bump e upsell, e com que preço | 4.2 | Arthur | ⬜ | | | Preço só com o ok do Arthur |
| 4.4 | Criar bumps e upsells aprovados | 4.3 | `04 Funil (Hotmart)` | ⬜ | | | Se não houver, marcar ➖ |
| 4.5 | Compra de teste (ou modo teste da Hotmart) e conferir a entrega ao comprador | 4.2 | Italo + Arthur | ⬜ | | | |

## Fase 5 — Página com pixel e UTM (E-01, E-02)

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 5.1 | Montar a página com a copy aprovada | 3.2, 2.8 | `03 Construtor` | ⬜ | | | Só copy aprovada |
| 5.2 | Instalar o pixel do Meta e o script de UTM | 2.7, 5.1 | `03 Construtor` | ⬜ | | | |
| 5.3 | Colocar o link do checkout da Hotmart em todos os botões | 4.2, 5.1 | `03 Construtor` | ⬜ | | | |
| 5.4 | Publicar a página no domínio definido | 5.1–5.3 | `03 Construtor` + Italo | ⬜ | | | |
| 5.5 | Conferir que o **PageView dispara** (Gestor de Eventos da Meta ou Pixel Helper) | 5.4 | Italo / `06 Revisor` | ⬜ | | | Obrigatório antes de qualquer anúncio |

## Fase 6 — Criativos (E-04)

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 6.1 | Produzir os 5 vídeos curtos a partir dos roteiros aprovados | 3.2 | `05 Claquete` + Arthur | ⬜ | | | Sem antes/depois nem promessa de resultado físico |
| 6.2 | Produzir as 3 imagens estáticas a partir dos briefings aprovados | 3.2 | `05 Claquete` | ⬜ | | | Não reutilizar imagens de terceiros |
| 6.3 | Arthur aprova os criativos | 6.1, 6.2 | Arthur | ⬜ | | | |

## Fase 7 — Revisão final (E-05)

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 7.1 | Revisor roda o checklist de 7 itens (links, pixel, preço, idioma, erros...) com evidência de cada item | 4.5, 5.5, 6.3 | `06 Revisor` | ⬜ | | | Só aprova a 100% |
| 7.2 | Corrigir o que o Revisor apontar e repetir 7.1 | 7.1 | conforme o item | ⬜ | | | |

## Fase 8 — Campanhas pausadas (E-06)

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 8.1 | Arthur define a estrutura de teste e o orçamento diário | 7.1 | Arthur | ⬜ | | | |
| 8.2 | Subir as campanhas pela API **sempre PAUSADAS** | 8.1, 2.5 | `07 Tráfego` | ⬜ | | | |
| 8.3 | Conferir pela API que tudo ficou `PAUSED` | 8.2 | Italo / `07 Tráfego` | ⬜ | | | |

## Fase 9 — Ativação e acompanhamento (E-07)

| # | Tarefa | Depende de | Responsável | Status | Feito por | Data | Evidência / observações |
|---|---|---|---|---|---|---|---|
| 9.1 | Ativar as campanhas | 8.3 | **Só o Arthur** | ⬜ | | | Nenhuma IA nem workflow ativa |
| 9.2 | Combinar como e quando ler os resultados (gasto, cliques, vendas) e registrar a leitura no histórico | 9.1 | Italo + Arthur | ⬜ | | | Números só de fonte real |
| 9.3 | Decidir manter, ajustar ou pausar, e se o Radar parte para a próxima oferta ou país | 9.2 | Arthur | ⬜ | | | |

---

## Registro de quem fez o quê

Uma linha por tarefa concluída (ou por avanço importante), a mais recente por cima. Assim dá para ver de relance o que cada pessoa fez.

| Data | Quem | Tarefa(s) | O que fez | Entrada no histórico |
|---|---|---|---|---|
| 2026-11-26 | Italo (com Claude) | — | Criou este plano de ação | H-20261126-italo-02 |
