# Mapa de dependências entre ações

Este mapa mostra como cada ação se liga às outras: o que veio antes, o que está bloqueado e por quê. **Atualize-o a cada entrada nova do `CHANGELOG.md`** (regras em `AGENTS.md`).

Legenda dos nós:

| Prefixo | Significa |
|---|---|
| `C-NN` | Marco do **contexto original**, anterior a este repositório (fonte: `contexto/00-LEIA-PRIMEIRO.md`, secção 3). Não muda mais. |
| `H-...` | Entrada do `CHANGELOG.md`. |
| `P-NN` | **Pendência**: decisão ou acesso que falta. Bloqueia o que aponta para ela. |
| `E-NN` | **Etapa futura** do fluxo do time, ainda não feita. Quando acontecer, vira uma entrada `H-...` e aponta para cá. |

Setas: `A --> B` quer dizer **"B depende de A"** (A tem de existir ou estar resolvido antes de B).

---

## Grafo

```mermaid
flowchart TD
  %% Contexto original (25/11/2026, antes do repositório)
  C01["C-01 Time de 7 agentes criado"]
  C02["C-02 Portugal escolhido como 1.º país"]
  C03["C-03 Radar: ofertas 1 a 6"]
  C04["C-04 Radar: ofertas 7 a 10"]
  C05["C-05 Oferta escolhida: Desafio Pilates em Casa 50+"]
  C06["C-06 Headline Killer entrega copy PT-PT (não aprovada)"]
  C07["C-07 Pacote de contexto gerado"]

  C01 --> C02 --> C03 --> C04 --> C05 --> C06 --> C07

  %% Repositório
  H01["H-20261125-italo-01 Repositório criado + histórico iniciado"]
  C07 --> H01
  H02["H-20261125-italo-02 Convite do Arthur no GitHub (falhou)"]
  H03["H-20261125-italo-03 Time Direct Response no n8n"]
  H04["H-20261126-italo-01 Acessos ao GitHub registrados"]
  H05["H-20261126-italo-02 Plano de ação criado"]
  H06["H-20261127-italo-01 Plano vira especificação técnica do n8n"]
  H07["H-20261127-italo-02 Avaliação + divisão Claude × Grok"]
  H08["H-20261127-italo-03 Gerador n8n no repositório"]
  H09["H-20261127-italo-04 99 Erros + repetições"]
  H10["H-20261127-italo-05 Estado entre rodadas + copy congelada"]
  H11["H-20261127-italo-06 Tráfego sem duplicar + Radar paginado"]
  H12["H-20261127-italo-07 Gerador publicado no n8n"]
  H01 --> H02 --> H04 --> H05 --> H06
  H06 --> H07 --> H08 --> H09 --> H10 --> H11
  H11 --> H12
  H03 --> H08
  H03 --> H06
  C01 --> H03

  HG01["H-20261127-grok-01 G-05 perguntas para o Arthur"]
  HG01 --> P13
  HG01 --> P14
  H12 --> HG01

  HG02["H-20261127-grok-02 G-01 API da Hotmart"]
  HG01 --> HG02

  HG03["H-20261127-grok-03 G-02 Meta Marketing API"]
  HG03 --> P14
  HG02 --> HG03

  HG04["H-20261127-grok-04 G-03 hospedagem"]
  HG03 --> HG04

  %% Pendências abertas
  P01{{"P-01 Formato das aulas"}}
  P02{{"P-02 Preço em euro"}}
  P03{{"P-03 Garantia / reembolso UE"}}
  P04{{"P-04 Instrutora e marca em PT"}}
  P05{{"P-05 Depoimentos reais"}}
  P06{{"P-06 Números de autoridade da instrutora"}}
  P07{{"P-07 Entregáveis reais confirmados"}}
  P08{{"P-08 Aprovação da copy final pelo Arthur"}}
  P09{{"P-09 Acessos Hotmart / Meta Ads / pixel"}}
  P10{{"P-10 Convidar ArthurSantosss no GitHub ✅"}}
  P11{{"P-11 Claude GitHub App no repositório"}}
  P12{{"P-12 Preencher credenciais DR no n8n"}}
  P13{{"P-13 Bumps e upsell: conteúdo e preços"}}
  P14{{"P-14 Página, moeda da conta e pagador/beneficiário DSA"}}
  H02 --> P10
  H04 --> P10
  H04 --> P11
  H03 --> P12
  P09 --> P12

  C06 --> P01 & P02 & P03 & P04 & P05 & P06 & P07
  P01 & P02 & P03 & P04 & P05 & P06 & P07 --> P08

  %% Etapas futuras do fluxo
  E01["E-01 Construtor: página + pixel + UTM"]
  E02["E-02 Conferir PageView"]
  E03["E-03 Funil: produto, checkout €, bumps, upsells"]
  E04["E-04 Claquete: criativos"]
  E05["E-05 Revisor: checklist 7 itens a 100%"]
  E06["E-06 Tráfego: campanhas PAUSADAS"]
  E07["E-07 Arthur ativa campanhas"]

  P08 --> E01
  P09 --> E01
  P02 & P03 & P07 & P09 --> E03
  P08 --> E04
  E01 --> E02
  E03 --> E01
  E02 & E03 & E04 --> E05
  E05 --> E06 --> E07
  P13 --> E03
  P14 --> E06
```

> O GitHub renderiza este bloco como diagrama. Num editor sem Mermaid, use a tabela abaixo, que tem a mesma informação.

---

## Tabela de nós

### Marcos do contexto original (fechados)

| Nó | O que foi | Depende de | Fonte |
|---|---|---|---|
| C-01 | Arthur pediu o time; coordenador criou os 7 agentes (secção "Direct Response" não foi criada). | — | `contexto/00-LEIA-PRIMEIRO.md` §2–3 |
| C-02 | Arthur escolheu Portugal. | C-01 | §3 item 3 |
| C-03 | Radar entregou ofertas 1–6 (~16:27). | C-02 | §3 item 6; `contexto/01-ofertas-radar.md` |
| C-04 | Radar entregou ofertas 7–10 (~16:50). | C-03 | §3 item 8 |
| C-05 | Arthur escolheu a oferta 10, Desafio Pilates em Casa 50+. | C-04 | §3 item 9; §4 |
| C-06 | Headline Killer entregou página adaptada, 10 headlines, 5 vídeos, 3 estáticas (~17:10). Copy **não aprovada**. | C-05 | `contexto/02-entrega-headline-killer.md` |
| C-07 | Pacote de contexto montado para a IA parceira (~20:58). | C-06 | §3 item 12 |

### Entradas do histórico

| Nó | Resumo | Continua | Depende de | Resolve | Abre |
|---|---|---|---|---|---|
| H-20261125-italo-01 | Repositório criado, contexto importado, sistema de histórico iniciado. | C-07 | — | — | P-01 a P-09 (registradas a partir do contexto) |
| H-20261125-italo-02 | Tentativa de convidar `ArthurSantosss` pela API do GitHub (falhou). | H-20261125-italo-01 | — | — | P-10 |
| H-20261125-italo-03 | 8 workflows `Direct Response` criados no n8n (`localhost:5678`), Tráfego sempre PAUSED, país padrão Portugal. | C-01 | — | — | P-12 |
| H-20261126-italo-01 | `Italomelo01` virou colaborador; `ArthurSantosss` já aparece como colaborador; Claude GitHub App ainda não instalada no repositório. | H-20261125-italo-02 | — | P-10 | P-11 |
| H-20261126-italo-02 | Plano de ação editável criado em `plano/PLANO-DE-ACAO.md` (fases 0 a 9, cobre P-01 a P-12 e E-01 a E-07). | H-20261126-italo-01 | — | — | — |
| H-20261127-italo-01 | `plano/PLANO-DE-ACAO.md` reescrito como especificação técnica dos 8 workflows do n8n, com backlog D/T/V. | H-20261126-italo-02 | H-20261125-italo-03 | — | — |
| H-20261127-italo-02 | Avaliação da estrutura e divisão de tarefas Claude (C-01..08) × Grok (G-01..06) × Italo (I-01..05) em `plano/DIVISAO-TAREFAS.md`. | H-20261127-italo-01 | — | — | — |
| H-20261127-italo-03 | Gerador do fluxo n8n (`tools/`, `workflows/`) copiado para `n8n/` (T-01, V-01). | H-20261127-italo-02 | H-20261125-italo-03 | — | — |
| H-20261127-italo-04 | Workflow `99 Erros` e repetições dos nós Grok/HTTP no gerador (T-02, falta publicar). | H-20261127-italo-03 | H-20261127-italo-03 | — | — |
| H-20261127-italo-05 | Estado entre rodadas em `estado.json` e copy congelada por `copy_aprovada_hash` (T-03, falta publicar). | H-20261127-italo-04 | H-20261127-italo-03 | — | — |
| H-20261127-italo-06 | Tráfego procura campanha por nome antes de criar; Radar paginado (T-07, falta publicar). | H-20261127-italo-05 | H-20261127-italo-03 | — | — |
| H-20261127-italo-07 | Gerador publicado no n8n do PC: 99 Erros `rUNQVY24WtvxDK5l` ativo e *Error workflow* dos outros 8; gerador passa a ativar o 99 Erros (o n8n 2.x exige). | H-20261127-italo-06 | H-20261127-italo-03 | — | — |
| H-20261127-grok-01 | G-05: mensagem com as perguntas para o Arthur em `plano/rascunhos/perguntas-arthur.md`. | H-20261127-italo-07 | — | — | P-13, P-14 |
| H-20261127-grok-02 | G-01: pesquisa da API da Hotmart em `plano/pesquisa/hotmart-api.md`. | H-20261127-grok-01 | — | — | — |
| H-20261127-grok-03 | G-02: pesquisa da Meta Marketing API e da Ad Library em `plano/pesquisa/meta-ads-api.md`; ajusta P-14 (inclui DSA). | H-20261127-grok-02 | — | — | — |
| H-20261127-grok-04 | G-03: comparação de hospedagens em `plano/pesquisa/hospedagem.md` (recomendação: Netlify; plano B Cloudflare). | H-20261127-grok-03 | — | — | — |

### Pendências

| Nó | Pendência | Estado | Quem decide | Bloqueia | Fonte |
|---|---|---|---|---|---|
| P-01 | Formato das aulas (`[FORMATO]`): ao vivo no fuso de Lisboa, gravadas, PDF + vídeos, instrutora em PT... | ⏳ aberta | Arthur | P-08 → E-01, E-04 | `00-LEIA` §5.1 |
| P-02 | Preço em euro (`[PREÇO]`). Referência 9,90–14,90 € (19,90 € citado como exemplo). Sem preço riscado. | ⏳ aberta | Arthur | P-08, E-03 | §5.2 |
| P-03 | Garantia / reembolso na UE (livre resolução de 14 dias ou regra explícita no checkout). | ⏳ aberta | Arthur | P-08, E-03 | §5.3 |
| P-04 | Quem assina a oferta em PT: Lays Trancoso / Lays Sant'anna ou instrutora e marca locais. | ⏳ aberta | Arthur | P-08 | §5.4 |
| P-05 | Depoimentos reais e autorizados para `[ESPAÇO PARA PROVA REAL]`. | ⏳ aberta | Arthur | P-08 | §5.5 |
| P-06 | Confirmar ou retirar "7 anos" e "20 mil mulheres 50+" (`[PROVA REAL A CONFIRMAR]`). | ⏳ aberta | Arthur | P-08 | §5.6 |
| P-07 | Entregáveis reais: gravações 12 meses, grupo WhatsApp, guia de compras. | ⏳ aberta | Arthur | P-08, E-03 | §5.7 |
| P-08 | Aprovação da copy final (depende de P-01 a P-07 preenchidas). | ⏳ aberta | Arthur | E-01, E-04 | §3 item 11; regra do Construtor |
| P-09 | Acessos à Hotmart, Meta Ads e pixel (ainda não pedidos nem configurados). | ⏳ aberta | Arthur / amigo | E-01, E-03 | §2 regras transversais |
| P-10 | Convidar `ArthurSantosss` como colaborador do repositório (a API bloqueou). | ✅ resolvida em H-20261126-italo-01 | italoxdemelo (dono) | — | H-20261125-italo-02 |
| P-11 | Instalar a Claude GitHub App em `italoxdemelo` com acesso a `direct-response`, para o Claude registrar sem usar o navegador. | ⏳ aberta | Italo | — | H-20261126-italo-01 |
| P-12 | Preencher no n8n as credenciais `DR · xAI Grok`, `DR · Meta (token de sistema)` e `DR · Hotmart` (valores nunca no Git). | ⏳ aberta | Italo / Arthur | workflows do n8n (E-01 a E-06 automatizados) | H-20261125-italo-03 |
| P-13 | Conteúdo e preço em euro de 2 a 3 order bumps e 1 upsell (contexto: o Arthur pediu "front, bumps e upsell" na conversa; os valores não vieram). | ⏳ aberta | Arthur | E-03 | `plano/rascunhos/perguntas-arthur.md` (H-20261127-grok-01) |
| P-14 | Página do Facebook (e conta do Instagram) que assina os anúncios, moeda da conta de anúncios e pagador e beneficiário (DSA, anúncios na UE). Hipótese para confirmar: a Marketing API exige `page_id` no criativo e `daily_budget` na moeda da conta; conjuntos que miram a UE pedem `dsa_payor` e `dsa_beneficiary`. | ⏳ aberta | Arthur / Italo | E-06 | `plano/rascunhos/perguntas-arthur.md` (H-20261127-grok-01) |

Ao fechar uma pendência: troque `⏳ aberta` por `✅ resolvida em H-...` e, no grafo, adicione a seta `Hxx --> Pxx`.

### Etapas futuras

| Nó | Etapa | Agente | Depende de | Regra crítica |
|---|---|---|---|---|
| E-01 | Montar e publicar página com pixel e UTM | Construtor | P-08, P-09, E-03 (link do checkout) | Só copy aprovada pelo Arthur. |
| E-02 | Conferir que o PageView dispara | Construtor / Revisor | E-01 | Antes de qualquer anúncio. |
| E-03 | Produto, checkout em €, bumps e upsells na Hotmart | Funil | P-02, P-03, P-07, P-09, P-13 | Preço só com ok do Arthur. |
| E-04 | Criativos (vídeo e imagem) | Claquete | P-08 | Sem prova social falsa nem claims proibidos. |
| E-05 | Revisão final, checklist de 7 itens | Revisor | E-02, E-03, E-04 | Só aprova a 100%, com evidência. |
| E-06 | Subir campanhas | Tráfego | E-05, P-14 | **Sempre pausadas**; conferir pela API. |
| E-07 | Ativar campanhas | Arthur | E-06 | Só o Arthur ativa. |
