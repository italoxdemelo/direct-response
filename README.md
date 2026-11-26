# Direct Response

Projeto de **levar ofertas low ticket de infoproduto que já escalaram no Brasil para outros países**, começando por **Portugal**. A primeira oferta escolhida é o **Desafio Pilates em Casa 50+**, com a copy já adaptada para PT-PT e à espera das decisões do Arthur.

Este repositório é a memória compartilhada do projeto: o contexto de partida, as regras do time e um **histórico que toda IA consulta antes de agir**.

## Por onde começar

| Se você é... | Leia |
|---|---|
| Uma IA (Claude, Codex etc.) | `AGENTS.md` (ou `CLAUDE.md`). Ele manda ler o histórico antes de qualquer ação. |
| Uma pessoa entrando agora | `contexto/00-LEIA-PRIMEIRO.md` e depois `historico/CHANGELOG.md`. |
| Alguém querendo saber o que falta fazer e quem fez o quê | `plano/PLANO-DE-ACAO.md`. |
| Alguém querendo saber o que está travado | `historico/MAPA-DEPENDENCIAS.md`, nas tabelas de pendências (`P-xx`) e de etapas futuras (`E-xx`). |

## Estrutura

```
.
├── AGENTS.md                  regras para qualquer IA (ler/atualizar histórico, regras do projeto, segredos)
├── CLAUDE.md                  aponta para AGENTS.md + resumo obrigatório
├── plano/
│   └── PLANO-DE-ACAO.md       tarefas por fase, responsável, status e quem fez o quê
├── historico/
│   ├── CHANGELOG.md           log de decisões, entradas datadas, mais recente no topo
│   ├── MAPA-DEPENDENCIAS.md   grafo e tabelas de como as ações e pendências se ligam
│   └── MODELO-ENTRADA.md      modelo para novas entradas
└── contexto/                  pacote original de 25/11/2026 (não editar)
    ├── 00-LEIA-PRIMEIRO.md    objetivo, time de 7 agentes, regras, linha do tempo, pendências
    ├── 01-ofertas-radar.md    as 10 ofertas mineradas pelo Radar (BR → PT)
    ├── 02-entrega-headline-killer.md   página adaptada, headlines e roteiros (PT-PT)
    ├── headline-killer/pilates50-pt/   original da entrega + mensagem ao coordenador
    └── radar/{br,pt}/         prints da Biblioteca de Anúncios e das páginas de venda
```

`contexto/02-entrega-headline-killer.md` e `contexto/headline-killer/pilates50-pt/entrega.md` são cópias idênticas. Foram mantidas as duas porque o `00-LEIA-PRIMEIRO.md` cita ambos os caminhos.

## Como o histórico funciona

1. **Antes de agir**, a IA roda `git pull --rebase`, lê as últimas entradas do `CHANGELOG.md` e o mapa, e diz qual entrada a ação continua ou de qual depende.
2. **Depois de agir**, ela registra uma entrada nova (ID `H-AAAAMMDD-autor-NN`) com o que mudou, por quê, os arquivos tocados e a entrada anterior que a ação continua ou de que depende. Também atualiza o mapa, faz commit com o ID na mensagem e dá push.
3. Pendências (`P-xx`) bloqueiam etapas (`E-xx`). Uma ação bloqueada por pendência aberta não é executada sem perguntar.

## Trabalhando em duas máquinas

- Cada pessoa clona o repositório e trabalha na branch `main`, sempre com `git pull --rebase` antes e `git push` logo depois.
- Se der conflito no topo do `CHANGELOG.md`, mantenha as duas entradas (a mais recente por cima). Os IDs incluem o autor, então não colidem.
- **Credenciais** (Hotmart, Meta Ads, pixel, servidor) nunca entram no Git. Use `.env` (ignorado pelo `.gitignore`) ou o gerenciador de segredos do servidor.

## Regras que não se negociam

Nunca inventar dados. Sem prova social falsa nem preço riscado falso. Respeitar as regras de saúde da Meta. Conferir o PageView antes dos anúncios. Campanhas sobem **pausadas** e só o Arthur ativa. Os detalhes estão em `AGENTS.md`.

## Sobre o conteúdo

Os prints em `contexto/radar/` são capturas de páginas públicas (Biblioteca de Anúncios do Meta e páginas de venda de terceiros), guardadas como pesquisa interna. Não reutilize imagens, marcas ou textos de terceiros nos criativos.
