# Direct Response

Projeto de **levar ofertas low ticket de infoproduto que já escalaram no Brasil para outros países**, começando por **Portugal**. A primeira oferta escolhida é o **Desafio Pilates em Casa 50+**, com a copy já adaptada para PT-PT e à espera das decisões do Arthur.

Este repositório é a memória compartilhada do projeto: o contexto de partida, as regras do time e um **histórico que toda IA consulta antes de agir**.

## Por onde começar

| Se você é... | Leia |
|---|---|
| Uma IA (Claude, Codex, Cursor, Grok etc.) | `AGENTS.md` (ou `CLAUDE.md`). Ele manda ler o histórico antes de qualquer ação e o playbook das aulas quando o assunto for oferta, copy, página, funil ou tráfego. |
| Uma pessoa entrando agora | `contexto/00-LEIA-PRIMEIRO.md` e depois `historico/CHANGELOG.md`. |
| Alguém querendo saber o que está travado | `historico/MAPA-DEPENDENCIAS.md`, nas tabelas de pendências (`P-xx`) e de etapas futuras (`E-xx`). |
| Quem for escrever oferta, copy, página, funil ou campanha | [Aulas — Índice e Playbook](aulas/Aulas%20-%20%C3%8Dndice%20e%20Playbook.md). As regras do projeto vencem a aula quando os dois divergem (`AGENTS.md`, seções 3 e 8). |

## Estrutura

```
.
├── AGENTS.md                  regras para qualquer IA (ler/atualizar histórico, regras do projeto, segredos)
├── CLAUDE.md                  aponta para AGENTS.md + resumo obrigatório
├── historico/
│   ├── CHANGELOG.md           log de decisões, entradas datadas, mais recente no topo
│   ├── MAPA-DEPENDENCIAS.md   grafo e tabelas de como as ações e pendências se ligam
│   └── MODELO-ENTRADA.md      modelo para novas entradas
├── aulas/                     11 aulas de direct response (26/11/2026) + playbook
│   ├── Aulas.md               índice e trilha
│   ├── Aulas - Índice e Playbook.md   playbook por tema; consulta dos agentes
│   ├── *.md                   notas-resumo
│   └── Detalhado/             notas aprofundadas, uma por aula
├── operacao/                  fichas da oferta Pilates 50+ (decisões em aberto; não edita contexto/)
└── contexto/                  pacote original de 25/11/2026 (não editar)
    ├── 00-LEIA-PRIMEIRO.md    objetivo, time de 7 agentes, regras, linha do tempo, pendências
    ├── 01-ofertas-radar.md    as 10 ofertas mineradas pelo Radar (BR → PT)
    ├── 02-entrega-headline-killer.md   página adaptada, headlines e roteiros (PT-PT)
    ├── headline-killer/pilates50-pt/   original da entrega + mensagem ao coordenador
    └── radar/{br,pt}/         prints da Biblioteca de Anúncios e das páginas de venda
```

`contexto/02-entrega-headline-killer.md` e `contexto/headline-killer/pilates50-pt/entrega.md` são cópias idênticas. Foram mantidas as duas porque o `00-LEIA-PRIMEIRO.md` cita ambos os caminhos.

## Como o histórico funciona

1. **Antes de agir**, a IA roda `git pull --rebase`, lê as últimas entradas do `CHANGELOG.md` e o mapa, e diz qual entrada a ação continua ou de qual depende. Se o assunto for oferta, copy, página, funil ou tráfego, lê também o playbook em `aulas/`.
2. **Depois de agir**, ela registra uma entrada nova (ID `H-AAAAMMDD-autor-NN`) com o que mudou, por quê, os arquivos tocados e a entrada anterior que a ação continua ou de que depende. Também atualiza o mapa, faz commit com o ID na mensagem e dá push.
3. Pendências (`P-xx`) bloqueiam etapas (`E-xx`). Uma ação bloqueada por pendência aberta não é executada sem perguntar.

## Trabalhando em duas máquinas

- Cada pessoa clona o repositório e trabalha na branch `main`, sempre com `git pull --rebase` antes e `git push` logo depois.
- Se der conflito no topo do `CHANGELOG.md`, mantenha as duas entradas (a mais recente por cima). Os IDs incluem o autor, então não colidem.
- **Credenciais** (Hotmart, Meta Ads, pixel, servidor) nunca entram no Git. Use `.env` (ignorado pelo `.gitignore`) ou o gerenciador de segredos do servidor.

## Regras que não se negociam

Nunca inventar dados. Sem prova social falsa nem preço riscado falso. Respeitar as regras de saúde da Meta. Conferir o PageView antes dos anúncios. Campanhas sobem **pausadas** e só o Arthur ativa. Os detalhes estão em `AGENTS.md`.

## Aulas

Notas em pt-BR das 11 aulas de low ticket que o Arthur separou em 26/11/2026 (Germano Morandi / Escale, Guilherme Franklin, Guilherme Asvi, Allanzord e Balaclava). Entraram em 27/11/2026 para os agentes consultarem ao trabalhar a oferta.

| Para quê | Arquivo |
|---|---|
| Índice, trilha e números de referência | [Aulas](aulas/Aulas.md) |
| Playbook por tema (oferta, promessa, mecanismo, copy, VSL, criativo, página, funil, Bid Cap, métrica, escala) | [Aulas — Índice e Playbook](aulas/Aulas%20-%20%C3%8Dndice%20e%20Playbook.md) |
| Nota aprofundada de cada aula | `aulas/Detalhado/` |

O playbook junta o que os professores disseram e aponta onde eles divergem entre si. Onde a aula diverge da regra do projeto (prova social, preço riscado, saúde, garantia, campanha pausada), fica a regra do projeto, registrada na seção 8 de `AGENTS.md`. Números citados nas aulas não são métrica desta oferta. O aviso no topo do playbook repete essa precedência.

## Operação da oferta Pilates 50+

Fichas para o time preencher com o Arthur. Nenhuma decisão está tomada. Não substituem o plano técnico do n8n, que está em `plano/PLANO-DE-ACAO.md` na branch `plano/H-20261126-italo-02`.

| Para quê | Arquivo |
|---|---|
| P-01 a P-07 e a D-09 (tráfego), com espaço para o ok | [Decisões do Arthur](operacao/decisoes-arthur.md) |
| Mecanismo em branco, com regra de prova | [Folha de mecanismo](operacao/mecanismo.md) |
| Equação de valor da copy atual, sem reescrever | [Auditoria da copy](operacao/auditoria-copy.md) |
| Esteira no painel da Hotmart, preços em branco | [Roteiro do funil](operacao/funil-hotmart.md) |
| O que a página não herda das aulas | [Proibições](operacao/pagina-proibicoes.md) |
| Avisos ao lado dos 7 itens do Revisor (não são um segundo portão) | [Anexo do Revisor](operacao/anexo-revisor.md) |
| Métricas de Portugal, só depois de V-04 | [Ficha de métricas](operacao/metricas-pt.md) |
| O que o Italo aplica no gerador quando o código entrar no repo | [Notas para o gerador](operacao/notas-para-o-gerador.md) |

## Sobre o conteúdo

Os prints em `contexto/radar/` são capturas de páginas públicas (Biblioteca de Anúncios do Meta e páginas de venda de terceiros), guardadas como pesquisa interna. Não reutilize imagens, marcas ou textos de terceiros nos criativos.
